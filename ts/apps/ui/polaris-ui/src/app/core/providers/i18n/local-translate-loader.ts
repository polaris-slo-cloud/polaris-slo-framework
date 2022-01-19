import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of as observableOf } from 'rxjs';

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
    [section: string]: Record<string, string>;
}

interface MultiLanguageTranslations {
    [key: string]: {
        [language: string]: string;
    };
}

function getTranslations(jsonModule: any): MultiLanguageTranslations {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
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
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            singleLang[sectionKey] = this.buildSingleLanguageSection((ALL_TRANSLATIONS as any)[sectionKey], lang);
        });

        return singleLang;
    }

    private buildSingleLanguageSection(multiLangSection: MultiLanguageTranslations, lang: string): Record<string, string> {
        const singleLangSection: Record<string, string> = {};
        Object.keys(multiLangSection).forEach(translationKey => {
            singleLangSection[translationKey] = multiLangSection[translationKey][lang];
        });
        return singleLangSection;
    }

}
