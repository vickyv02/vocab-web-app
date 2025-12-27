export class Vocabulary {
}

export interface VocabularyItem {
    id: string;
    vocab: string;
    translation: string;
    example?: string;
    category: VocabularyCategory;
    createdAt: Date;
}

export interface NewVocabularyItem {
    vocab: string;
    translation: string;
    example?: string;
    category: VocabularyCategory;
}

export interface VocabularyList {
    id: string;
    name: string;
    description?: string;
    language: ListLanguage;
    items?: VocabularyItem[]; // only for detail view
    itemCount: number;
    createdAt: Date;
}

export enum VocabularyCategory {
    Noun = 'noun',
    Verb = 'verb',
    AdjectiveAdverb = 'adjective_adverb',
    PhraseIdiom = 'phrase_idiom',
    Other = 'other'
}

export enum ListLanguage {
    English = 'en',
    German = 'de',
    Chinese = 'cn',
    Korean = 'kr'
}