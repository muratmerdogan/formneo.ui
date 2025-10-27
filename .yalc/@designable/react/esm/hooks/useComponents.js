import { useContext } from 'react';
import { DesignerComponentsContext } from '../context';
export var useComponents = function () { return useContext(DesignerComponentsContext); };
