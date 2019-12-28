import {camelCase} from 'lodash';

export function pascalCase(string) {
    return string.slice(0, 1).toUpperCase() + camelCase(string).slice(1);
}
