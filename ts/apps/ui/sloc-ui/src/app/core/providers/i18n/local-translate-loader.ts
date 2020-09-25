import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of as observableOf } from 'rxjs';
import { IndexByKey } from '../../../common';

import * as COMMON from './translations/common.translations.json';
import * as VISUALIZATION from './translations/visualization.translations.json';

/**
 * A single language translations object has the following format:
 * ```
 * {
 *      "common": {
 *          "ok": "OK",
 *          "cancel": "Cancel"
 *      },
 *      "visualization": {
 *          "graph": "Graph"
 *      }
 * }
 * ```
 */
export interface SingleLanguageTranslations {
    [section: string]: IndexByKey<string>;
}

interface MultiLanguageTranslations {
    [key: string]: {
        [language: string]: string;
    };
}

function getTranslations(jsonModule: any): MultiLanguageTranslations {
    return jsonModule.default;
}

const ALL_TRANSLATIONS = {
    common: getTranslations(COMMON),
    visualization: getTranslations(VISUALIZATION),
};

export class LocalTranslateLoader implements TranslateLoader {

    getTranslation(lang: string): Observable<SingleLanguageTranslations> {
        const translations = this.buildSingleLanguageTranslations(lang);
        return observableOf(translations);
    }

    private buildSingleLanguageTranslations(lang: string): SingleLanguageTranslations {
        const singleLang: SingleLanguageTranslations = {};

        Object.keys(ALL_TRANSLATIONS).forEach(sectionKey => {
            singleLang[sectionKey] = this.buildSingleLanguageSection(ALL_TRANSLATIONS[sectionKey], lang);
        });

        return singleLang;
    }

    private buildSingleLanguageSection(multiLangSection: MultiLanguageTranslations, lang: string): IndexByKey<string> {
        const singleLangSection: IndexByKey<string> = {};
        Object.keys(multiLangSection).forEach(translationKey => {
            singleLangSection[translationKey] = multiLangSection[translationKey][lang];
        });
        return singleLangSection;
    }

}
