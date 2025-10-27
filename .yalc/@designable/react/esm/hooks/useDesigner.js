import { useContext, useEffect } from 'react';
import { DesignerEngineContext } from '../context';
import { isFn, globalThisPolyfill } from '@designable/shared';
export var useDesigner = function (effects) {
    var designer = globalThisPolyfill['__DESIGNABLE_ENGINE__'] ||
        useContext(DesignerEngineContext);
    useEffect(function () {
        if (isFn(effects)) {
            return effects(designer);
        }
    }, []);
    return designer;
};
