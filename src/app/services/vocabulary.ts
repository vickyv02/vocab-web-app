import { Injectable } from '@angular/core';
import { ListLanguage, NewVocabularyItem, VocabularyItem, VocabularyList } from '../models/vocabulary.model';
import { Auth, authState, signInAnonymously, User } from '@angular/fire/auth';
import { combineLatest, firstValueFrom, map, Observable, of, switchMap } from 'rxjs';
import { addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore, getDocs, increment, updateDoc, writeBatch } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class VocabularyService {
  user$: Observable<User | null>;

  constructor(private firestore: Firestore, private auth: Auth) {
    this.user$ = authState(this.auth);

    // anon login
    signInAnonymously(this.auth)
    .then(() => console.log('Anonymous sign-in successful.'))
    .catch((error) => console.error('Anonymous sign-in failed.', error));
  }

  getLists(): Observable<VocabularyList[]> {
    return this.user$.pipe(
      switchMap(user => {
        if (!user) return of([]);
        const listsCol = collection(this.firestore, `users/${user.uid}/lists`);
        return collectionData(listsCol, { idField: 'id' }) as Observable<VocabularyList[]>; // items: []
      })
    );
  }

  getListById(listId: string): Observable<VocabularyList | null> {
    return this.user$.pipe(
      switchMap((user) => {
        if (!user) return of(null);

        const listDocRef = doc(this.firestore, `users/${user.uid}/lists/${listId}`);
        const list$ = docData(listDocRef, { idField: 'id' }) as Observable<VocabularyList | null>;

        const itemsCol = collection(this.firestore, `users/${user.uid}/lists/${listId}/items`);
        const items$ = collectionData(itemsCol, { idField: 'id' }) as Observable<VocabularyItem[]>;

        return combineLatest([list$, items$]).pipe(
          map(([list, items]) => {
            if (!list) return null;
            return { ...list, items: items || [] };
          })
        )
      })
    )
  }
  
  async createList(name: string, language: ListLanguage, description?: string): Promise<VocabularyList> {
    const user = await firstValueFrom(this.user$.pipe(
      // wait until user is non null
    ))

    if (!user) throw new Error('User not logged in.');

    const listsCol = collection(this.firestore, `users/${user.uid}/lists`);
    const newList = {
      name,
      description: description || '',
      language: language,
      items: [],
      itemCount: 0,
      createdAt: new Date()
    };
    const docRef = await addDoc(listsCol, newList);
    return {
      id: docRef.id,
      ...newList
    } as VocabularyList;
  }

  async deleteList(listId: string): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('User not logged in.');

    const batch = writeBatch(this.firestore); // ensures all deletes happen atomically (all or nothing)

    const listDocRef = doc(this.firestore, `users/${user.uid}/lists/${listId}`);
    batch.delete(listDocRef);

    // delete the list's items also
    const itemsCol = collection(this.firestore, `users/${user.uid}/lists/${listId}/items`);
    const snapshot = await getDocs(itemsCol);
    snapshot.docs.forEach((docSnapshot) => {
      batch.delete(docSnapshot.ref);
    });

    await batch.commit();
  }

  async addItemToList(listId: string, newItem: NewVocabularyItem): Promise<VocabularyItem | null> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('User not logged in.');

    const listDocRef = doc(this.firestore, `users/${user.uid}/lists/${listId}`);
    
    const itemsCol = collection(this.firestore, `users/${user.uid}/lists/${listId}/items`);
    const vocabItem = {
      vocab: newItem.vocab,
      translation: newItem.translation,
      example: newItem.example || '',
      category: newItem.category,
      createdAt: new Date()
    };

    const itemRef = await addDoc(itemsCol, vocabItem);

    await updateDoc(listDocRef, { itemCount: increment(1) });

    return {
      id: itemRef.id,
      ...vocabItem
    } as VocabularyItem;
  }

  async deleteItemFromList(listId: string, itemId: string): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('User not logged in.');

    const batch = writeBatch(this.firestore); // ensures all deletes happen atomically (all or nothing)

    const itemDocRef = doc(this.firestore, `users/${user.uid}/lists/${listId}/items/${itemId}`);
    batch.delete(itemDocRef);
    
    const listDocRef = doc(this.firestore, `users/${user.uid}/lists/${listId}`);
    batch.update(listDocRef, { itemCount: increment(-1) });

    await batch.commit();
  }
}
