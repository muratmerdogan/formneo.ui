import { useContext } from 'react';
import { DesignerLayoutContext } from '../context';
import { globalThisPolyfill } from '@designable/shared';
export var useLayout = function () {
    return (globalThisPolyfill['__DESIGNABLE_LAYOUT__'] ||
        useContext(DesignerLayoutContext));
};
