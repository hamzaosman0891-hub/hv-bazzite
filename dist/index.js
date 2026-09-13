function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var jsxRuntime = {exports: {}};

var reactJsxRuntime_production_min = {};

var react = {exports: {}};

var react_production_min = {};

/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var l$1=Symbol.for("react.element"),n$1=Symbol.for("react.portal"),p$1=Symbol.for("react.fragment"),q$1=Symbol.for("react.strict_mode"),r=Symbol.for("react.profiler"),t=Symbol.for("react.provider"),u=Symbol.for("react.context"),v=Symbol.for("react.forward_ref"),w=Symbol.for("react.suspense"),x=Symbol.for("react.memo"),y=Symbol.for("react.lazy"),z=Symbol.iterator;function A(a){if(null===a||"object"!==typeof a)return null;a=z&&a[z]||a["@@iterator"];return "function"===typeof a?a:null}
var B={isMounted:function(){return !1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},C=Object.assign,D={};function E(a,b,e){this.props=a;this.context=b;this.refs=D;this.updater=e||B;}E.prototype.isReactComponent={};
E.prototype.setState=function(a,b){if("object"!==typeof a&&"function"!==typeof a&&null!=a)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,a,b,"setState");};E.prototype.forceUpdate=function(a){this.updater.enqueueForceUpdate(this,a,"forceUpdate");};function F(){}F.prototype=E.prototype;function G(a,b,e){this.props=a;this.context=b;this.refs=D;this.updater=e||B;}var H=G.prototype=new F;
H.constructor=G;C(H,E.prototype);H.isPureReactComponent=!0;var I=Array.isArray,J=Object.prototype.hasOwnProperty,K={current:null},L={key:!0,ref:!0,__self:!0,__source:!0};
function M(a,b,e){var d,c={},k=null,h=null;if(null!=b)for(d in void 0!==b.ref&&(h=b.ref),void 0!==b.key&&(k=""+b.key),b)J.call(b,d)&&!L.hasOwnProperty(d)&&(c[d]=b[d]);var g=arguments.length-2;if(1===g)c.children=e;else if(1<g){for(var f=Array(g),m=0;m<g;m++)f[m]=arguments[m+2];c.children=f;}if(a&&a.defaultProps)for(d in g=a.defaultProps,g)void 0===c[d]&&(c[d]=g[d]);return {$$typeof:l$1,type:a,key:k,ref:h,props:c,_owner:K.current}}
function N(a,b){return {$$typeof:l$1,type:a.type,key:b,ref:a.ref,props:a.props,_owner:a._owner}}function O(a){return "object"===typeof a&&null!==a&&a.$$typeof===l$1}function escape(a){var b={"=":"=0",":":"=2"};return "$"+a.replace(/[=:]/g,function(a){return b[a]})}var P=/\/+/g;function Q(a,b){return "object"===typeof a&&null!==a&&null!=a.key?escape(""+a.key):b.toString(36)}
function R(a,b,e,d,c){var k=typeof a;if("undefined"===k||"boolean"===k)a=null;var h=!1;if(null===a)h=!0;else switch(k){case "string":case "number":h=!0;break;case "object":switch(a.$$typeof){case l$1:case n$1:h=!0;}}if(h)return h=a,c=c(h),a=""===d?"."+Q(h,0):d,I(c)?(e="",null!=a&&(e=a.replace(P,"$&/")+"/"),R(c,b,e,"",function(a){return a})):null!=c&&(O(c)&&(c=N(c,e+(!c.key||h&&h.key===c.key?"":(""+c.key).replace(P,"$&/")+"/")+a)),b.push(c)),1;h=0;d=""===d?".":d+":";if(I(a))for(var g=0;g<a.length;g++){k=
a[g];var f=d+Q(k,g);h+=R(k,b,e,f,c);}else if(f=A(a),"function"===typeof f)for(a=f.call(a),g=0;!(k=a.next()).done;)k=k.value,f=d+Q(k,g++),h+=R(k,b,e,f,c);else if("object"===k)throw b=String(a),Error("Objects are not valid as a React child (found: "+("[object Object]"===b?"object with keys {"+Object.keys(a).join(", ")+"}":b)+"). If you meant to render a collection of children, use an array instead.");return h}
function S(a,b,e){if(null==a)return a;var d=[],c=0;R(a,d,"","",function(a){return b.call(e,a,c++)});return d}function T(a){if(-1===a._status){var b=a._result;b=b();b.then(function(b){if(0===a._status||-1===a._status)a._status=1,a._result=b;},function(b){if(0===a._status||-1===a._status)a._status=2,a._result=b;});-1===a._status&&(a._status=0,a._result=b);}if(1===a._status)return a._result.default;throw a._result;}
var U={current:null},V={transition:null},W={ReactCurrentDispatcher:U,ReactCurrentBatchConfig:V,ReactCurrentOwner:K};function X(){throw Error("act(...) is not supported in production builds of React.");}
react_production_min.Children={map:S,forEach:function(a,b,e){S(a,function(){b.apply(this,arguments);},e);},count:function(a){var b=0;S(a,function(){b++;});return b},toArray:function(a){return S(a,function(a){return a})||[]},only:function(a){if(!O(a))throw Error("React.Children.only expected to receive a single React element child.");return a}};react_production_min.Component=E;react_production_min.Fragment=p$1;react_production_min.Profiler=r;react_production_min.PureComponent=G;react_production_min.StrictMode=q$1;react_production_min.Suspense=w;
react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=W;react_production_min.act=X;
react_production_min.cloneElement=function(a,b,e){if(null===a||void 0===a)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+a+".");var d=C({},a.props),c=a.key,k=a.ref,h=a._owner;if(null!=b){void 0!==b.ref&&(k=b.ref,h=K.current);void 0!==b.key&&(c=""+b.key);if(a.type&&a.type.defaultProps)var g=a.type.defaultProps;for(f in b)J.call(b,f)&&!L.hasOwnProperty(f)&&(d[f]=void 0===b[f]&&void 0!==g?g[f]:b[f]);}var f=arguments.length-2;if(1===f)d.children=e;else if(1<f){g=Array(f);
for(var m=0;m<f;m++)g[m]=arguments[m+2];d.children=g;}return {$$typeof:l$1,type:a.type,key:c,ref:k,props:d,_owner:h}};react_production_min.createContext=function(a){a={$$typeof:u,_currentValue:a,_currentValue2:a,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null};a.Provider={$$typeof:t,_context:a};return a.Consumer=a};react_production_min.createElement=M;react_production_min.createFactory=function(a){var b=M.bind(null,a);b.type=a;return b};react_production_min.createRef=function(){return {current:null}};
react_production_min.forwardRef=function(a){return {$$typeof:v,render:a}};react_production_min.isValidElement=O;react_production_min.lazy=function(a){return {$$typeof:y,_payload:{_status:-1,_result:a},_init:T}};react_production_min.memo=function(a,b){return {$$typeof:x,type:a,compare:void 0===b?null:b}};react_production_min.startTransition=function(a){var b=V.transition;V.transition={};try{a();}finally{V.transition=b;}};react_production_min.unstable_act=X;react_production_min.useCallback=function(a,b){return U.current.useCallback(a,b)};react_production_min.useContext=function(a){return U.current.useContext(a)};
react_production_min.useDebugValue=function(){};react_production_min.useDeferredValue=function(a){return U.current.useDeferredValue(a)};react_production_min.useEffect=function(a,b){return U.current.useEffect(a,b)};react_production_min.useId=function(){return U.current.useId()};react_production_min.useImperativeHandle=function(a,b,e){return U.current.useImperativeHandle(a,b,e)};react_production_min.useInsertionEffect=function(a,b){return U.current.useInsertionEffect(a,b)};react_production_min.useLayoutEffect=function(a,b){return U.current.useLayoutEffect(a,b)};
react_production_min.useMemo=function(a,b){return U.current.useMemo(a,b)};react_production_min.useReducer=function(a,b,e){return U.current.useReducer(a,b,e)};react_production_min.useRef=function(a){return U.current.useRef(a)};react_production_min.useState=function(a){return U.current.useState(a)};react_production_min.useSyncExternalStore=function(a,b,e){return U.current.useSyncExternalStore(a,b,e)};react_production_min.useTransition=function(){return U.current.useTransition()};react_production_min.version="18.3.1";

{
  react.exports = react_production_min;
}

var reactExports = react.exports;
var React = /*@__PURE__*/getDefaultExportFromCjs(reactExports);

/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f=reactExports,k=Symbol.for("react.element"),l=Symbol.for("react.fragment"),m=Object.prototype.hasOwnProperty,n=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p={key:!0,ref:!0,__self:!0,__source:!0};
function q(c,a,g){var b,d={},e=null,h=null;void 0!==g&&(e=""+g);void 0!==a.key&&(e=""+a.key);void 0!==a.ref&&(h=a.ref);for(b in a)m.call(a,b)&&!p.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps,a)void 0===d[b]&&(d[b]=a[b]);return {$$typeof:k,type:c,key:e,ref:h,props:d,_owner:n.current}}reactJsxRuntime_production_min.Fragment=l;reactJsxRuntime_production_min.jsx=q;reactJsxRuntime_production_min.jsxs=q;

{
  jsxRuntime.exports = reactJsxRuntime_production_min;
}

var jsxRuntimeExports = jsxRuntime.exports;

const bgStyle1 = 'background: #16a085; color: black;';
const log = (name, ...args) => {
    console.log(`%c @decky/ui %c ${name} %c`, bgStyle1, 'background: #1abc9c; color: black;', 'background: transparent;', ...args);
};
const group = (name, ...args) => {
    console.group(`%c @decky/ui %c ${name} %c`, bgStyle1, 'background: #1abc9c; color: black;', 'background: transparent;', ...args);
};
const groupEnd = (name, ...args) => {
    console.groupEnd();
    if (args?.length > 0)
        console.log(`^ %c @decky/ui %c ${name} %c`, bgStyle1, 'background: #1abc9c; color: black;', 'background: transparent;', ...args);
};
const debug = (name, ...args) => {
    console.debug(`%c @decky/ui %c ${name} %c`, bgStyle1, 'background: #1abc9c; color: black;', 'color: blue;', ...args);
};
const warn = (name, ...args) => {
    console.warn(`%c @decky/ui %c ${name} %c`, bgStyle1, 'background: #ffbb00; color: black;', 'color: blue;', ...args);
};
const error = (name, ...args) => {
    console.error(`%c @decky/ui %c ${name} %c`, bgStyle1, 'background: #FF0000;', 'background: transparent;', ...args);
};
class Logger {
    constructor(name) {
        this.name = name;
        this.name = name;
    }
    log(...args) {
        log(this.name, ...args);
    }
    debug(...args) {
        debug(this.name, ...args);
    }
    warn(...args) {
        warn(this.name, ...args);
    }
    error(...args) {
        error(this.name, ...args);
    }
    group(...args) {
        group(this.name, ...args);
    }
    groupEnd(...args) {
        groupEnd(this.name, ...args);
    }
}
var Logger$1 = Logger;

const logger = new Logger$1('Webpack');
let modules = new Map();
function initModuleCache() {
    const startTime = performance.now();
    logger.group('Webpack Module Init');
    const id = Symbol("@decky/ui");
    let webpackRequire;
    window.webpackChunksteamui.push([
        [id],
        {},
        (r) => {
            webpackRequire = r;
        },
    ]);
    logger.log('Initializing all modules. Errors here likely do not matter, as they are usually just failing module side effects.');
    for (let id of Object.keys(webpackRequire.m)) {
        try {
            const module = webpackRequire(id);
            if (module) {
                modules.set(id, module);
            }
        }
        catch (e) {
            logger.debug('Ignoring require error for module', id, e);
        }
    }
    logger.groupEnd(`Modules initialized in ${performance.now() - startTime}ms...`);
}
initModuleCache();
const findModule = (filter) => {
    for (const m of modules.values()) {
        if (m.default && filter(m.default))
            return m.default;
        if (filter(m))
            return m;
    }
};
const findModuleDetailsByExport = (filter, minExports) => {
    for (const [id, m] of modules) {
        if (!m)
            continue;
        for (const mod of [m.default, m]) {
            if (typeof mod !== 'object')
                continue;
            if (mod == window)
                continue;
            if (minExports && Object.keys(mod).length < minExports)
                continue;
            for (let exportName in mod) {
                if (mod?.[exportName]) {
                    try {
                        const filterRes = filter(mod[exportName], exportName);
                        if (filterRes) {
                            return [mod, mod[exportName], exportName, id];
                        }
                        else {
                            continue;
                        }
                    }
                    catch (e) {
                        logger.warn("Webpack filter threw exception: ", e);
                    }
                }
            }
        }
    }
    return [undefined, undefined, undefined, undefined];
};
const findModuleByExport = (filter, minExports) => {
    return findModuleDetailsByExport(filter, minExports)?.[0];
};
const findModuleExport = (filter, minExports) => {
    return findModuleDetailsByExport(filter, minExports)?.[1];
};
const createModuleMapping = (filter) => {
    const mapping = new Map();
    for (const [id, m] of modules) {
        if (m.default && filter(m.default))
            mapping.set(id, m.default);
        if (filter(m))
            mapping.set(id, m);
    }
    return mapping;
};
const CommonUIModule = findModule((m) => {
    if (typeof m !== 'object')
        return false;
    for (let prop in m) {
        if (m[prop]?.contextType?._currentValue && Object.keys(m).length > 60)
            return true;
    }
    return false;
});
findModuleByExport((e) => e?.toString && /Spinner\),children:\[\(0,\w+\.jsx\)\("path",\{d:"M18 /.test(e.toString()) || /Spinner\)}\)?,.\.createElement\(\"path\",{d:\"M18 /.test(e.toString()));
findModuleByExport((e) => e.computeRootMatch);

const classModuleMap = createModuleMapping((m) => {
    if (typeof m == 'object' && !m.__esModule) {
        const keys = Object.keys(m);
        if (keys.length == 1 && m.version)
            return false;
        if (keys.length > 1000 && m.AboutSettings)
            return false;
        return keys.length > 0 && keys.every((k) => !Object.getOwnPropertyDescriptor(m, k)?.get && typeof m[k] == 'string');
    }
    return false;
});
const classMap = [...classModuleMap.values()];
function findClassModule(filter) {
    return classMap.find((m) => filter(m));
}

const quickAccessMenuClasses = findClassModule((m) => m.Title && m.QuickAccessMenu && m.BatteryDetailsLabels);
findClassModule((m) => m.ScrollPanel);
findClassModule((m) => m.GamepadDialogContent && !m.BindingButtons);
findClassModule((m) => m.BatteryPercentageLabel && m.PanelSection && !m['vr-dashboard-bar-height'] && !m.QuickAccessMenu && !m.QuickAccess && !m.PerfProfileInfo);
findClassModule((m) => m.OOBEUpdateStatusContainer);
findClassModule((m) => m.PlayBarDetailLabel);
findClassModule((m) => m.SliderControlPanelGroup);
findClassModule((m) => m.TopCapsule);
findClassModule((m) => m.HeaderLoaded);
findClassModule((m) => m.BasicUiRoot);
findClassModule((m) => m.GamepadTabbedPage);
findClassModule((m) => m.BasicContextMenuModal);
findClassModule((m) => m.AchievementListItemBase && !m.Page);
findClassModule((m) => m.AchievementListItemBase && m.Page);
findClassModule((m) => m.AppRunningControls && m.OverlayAchievements);
findClassModule((m) => m.AppDetailsRoot);
findClassModule(m => m.SpinnerLoaderContainer);
findClassModule(m => m.QuickAccessFooter);
findClassModule(m => m.PlayButtonContainer);
findClassModule(m => m.LongTitles && m.GreyBackground);
findClassModule(m => m.GamepadLibrary);
findClassModule(m => m.FocusRingRoot);
findClassModule(m => m.SearchAndTitleContainer);
findClassModule(m => m.MainBrowserContainer);
const staticClasses = quickAccessMenuClasses;

(undefined && undefined.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
function createPropListRegex(propList, fromStart = true) {
    let regexString = fromStart ? "const\{" : "";
    propList.forEach((prop, propIdx) => {
        regexString += `"?${prop}"?:[a-zA-Z_$]{1,2}`;
        if (propIdx < propList.length - 1) {
            regexString += ",";
        }
    });
    return new RegExp(regexString);
}
window.SP_REACT?.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED?.ReactCurrentDispatcher
    .current || Object.values(window.SP_REACT?.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE).find((p) => p?.useEffect);

function findSP() {
    if (document.title == 'SP')
        return window;
    const navTrees = getGamepadNavigationTrees();
    return navTrees?.find((x) => x.m_ID == 'GamepadUI_Full_Root' || x.m_ID == 'root_1_')?.Root?.Element?.ownerDocument?.defaultView;
}
function getFocusNavController() {
    return window.GamepadNavTree?.m_context?.m_controller || window.FocusNavController;
}
function getGamepadNavigationTrees() {
    const focusNav = getFocusNavController();
    const context = focusNav?.m_ActiveContext || focusNav?.m_LastActiveContext;
    return context?.m_rgGamepadNavigationTrees;
}

const buttonItemRegex = createPropListRegex(["highlightOnFocus", "childrenContainerWidth"], false);
const ButtonItem = Object.values(CommonUIModule).find((mod) => (mod?.render?.toString && buttonItemRegex.test(mod.render.toString())) ||
    mod?.render?.toString?.().includes('childrenContainerWidth:"min"'));

Object.values(CommonUIModule).find((mod) => mod?.prototype?.SetSelectedOption && mod?.prototype?.BuildMenu);
const dropdownItemRegex = createPropListRegex(["dropDownControlRef", "description"], false);
const DropdownItemInternal = Object.values(CommonUIModule).find((mod) => mod?.toString && dropdownItemRegex.test(mod.toString()));
const DropdownItem = ((args) => jsxRuntimeExports.jsx(DropdownItemInternal, { childrenContainerWidth: "min", ...args }));

const Field = findModuleExport((e) => (e?.toString()?.includes('().Field') && e?.toString()?.includes('"shift-children-below"')) || e?.render?.toString()?.includes('"shift-children-below"'));

const showModalRaw = findModuleExport((e) => typeof e === 'function' && e.toString().includes('props.bDisableBackgroundDismiss') && !e?.prototype?.Cancel);
const showModal = (modal, parent, props = {
    strTitle: 'Decky Dialog',
    bHideMainWindowForPopouts: false,
}) => {
    return showModalRaw(modal, parent || findSP() || window, props.strTitle, props, undefined, {
        bHideActions: props.bHideActionIcons,
    });
};
const ConfirmModal = findModuleExport((e) => e?.toString()?.includes('bUpdateDisabled') && e?.toString()?.includes('closeModal') && e?.toString()?.includes('onGamepadCancel'));
findModuleExport((e) => typeof e === 'function' && e.toString().includes('Either closeModal or onCancel should be passed to GenericDialog. Classes: ')) ||
    Object.values(findModule((m) => {
        if (typeof m !== 'object')
            return false;
        for (let prop in m) {
            if (m[prop]?.m_mapModalManager && Object.values(m)?.find((x) => x?.type)) {
                return true;
            }
        }
        return false;
    }) || {})?.find((x) => x?.type?.toString?.()?.includes('((function(){'));
const [ModalModule, _ModalPosition] = findModuleDetailsByExport((e) => e?.toString().includes('.ModalPosition'), 5);
const ModalModuleProps = ModalModule ? Object.values(ModalModule) : [];
ModalModuleProps.find((prop) => {
    const string = prop?.toString();
    return string?.includes('.ShowPortalModal()') && string?.includes('.OnElementReadyCallbacks.Register(');
});

const [mod, panelSection] = findModuleDetailsByExport((e) => e.toString()?.includes('.PanelSection'));
const PanelSection = panelSection;
const PanelSectionRow = Object.values(mod).filter((exp) => !exp?.toString?.()?.includes('.PanelSection'))[0];

const TextField = Object.values(CommonUIModule).find((mod) => mod?.validateUrl && mod?.validateEmail);

const ToggleField = Object.values(CommonUIModule).find((mod) => mod?.render?.toString?.()?.includes('ToggleField,fallback') || mod?.render?.toString?.()?.includes("ToggleField\","));

const definePlugin = (fn) => {
    return (...args) => {
        return fn(...args);
    };
};

var DefaultContext = {
  color: undefined,
  size: undefined,
  className: undefined,
  style: undefined,
  attr: undefined
};
var IconContext = React.createContext && /*#__PURE__*/React.createContext(DefaultContext);

var _excluded = ["attr", "size", "title"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function Tree2Element(tree) {
  return tree && tree.map((node, i) => /*#__PURE__*/React.createElement(node.tag, _objectSpread({
    key: i
  }, node.attr), Tree2Element(node.child)));
}
function GenIcon(data) {
  return props => /*#__PURE__*/React.createElement(IconBase, _extends({
    attr: _objectSpread({}, data.attr)
  }, props), Tree2Element(data.child));
}
function IconBase(props) {
  var elem = conf => {
    var attr = props.attr,
      size = props.size,
      title = props.title,
      svgProps = _objectWithoutProperties(props, _excluded);
    var computedSize = size || conf.size || "1em";
    var className;
    if (conf.className) className = conf.className;
    if (props.className) className = (className ? className + " " : "") + props.className;
    return /*#__PURE__*/React.createElement("svg", _extends({
      stroke: "currentColor",
      fill: "currentColor",
      strokeWidth: "0"
    }, conf.attr, attr, svgProps, {
      className: className,
      style: _objectSpread(_objectSpread({
        color: props.color || conf.color
      }, conf.style), props.style),
      height: computedSize,
      width: computedSize,
      xmlns: "http://www.w3.org/2000/svg"
    }), title && /*#__PURE__*/React.createElement("title", null, title), props.children);
  };
  return IconContext !== undefined ? /*#__PURE__*/React.createElement(IconContext.Consumer, null, conf => elem(conf)) : elem(DefaultContext);
}

// THIS FILE IS AUTO GENERATED
function FaTrash (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 448 512"},"child":[{"tag":"path","attr":{"d":"M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"},"child":[]}]})(props);
}function FaTools (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M501.1 395.7L384 278.6c-23.1-23.1-57.6-27.6-85.4-13.9L192 158.1V96L64 0 0 64l96 128h62.1l106.6 106.6c-13.6 27.8-9.2 62.3 13.9 85.4l117.1 117.1c14.6 14.6 38.2 14.6 52.7 0l52.7-52.7c14.5-14.6 14.5-38.2 0-52.7zM331.7 225c28.3 0 54.9 11 74.9 31l19.4 19.4c15.8-6.9 30.8-16.5 43.8-29.5 37.1-37.1 49.7-89.3 37.9-136.7-2.2-9-13.5-12.1-20.1-5.5l-74.4 74.4-67.9-11.3L334 98.9l74.4-74.4c6.6-6.6 3.4-17.9-5.7-20.2-47.4-11.7-99.6.9-136.6 37.9-28.5 28.5-41.9 66.1-41.2 103.6l82.1 82.1c8.1-1.9 16.5-2.9 24.7-2.9zm-103.9 82l-56.7-56.7L18.7 402.8c-25 25-25 65.5 0 90.5s65.5 25 90.5 0l123.6-123.6c-7.6-19.9-9.9-41.6-5-62.7zM64 472c-13.2 0-24-10.8-24-24 0-13.3 10.7-24 24-24s24 10.7 24 24c0 13.2-10.7 24-24 24z"},"child":[]}]})(props);
}function FaTimesCircle (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z"},"child":[]}]})(props);
}function FaSync (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M440.65 12.57l4 82.77A247.16 247.16 0 0 0 255.83 8C134.73 8 33.91 94.92 12.29 209.82A12 12 0 0 0 24.09 224h49.05a12 12 0 0 0 11.67-9.26 175.91 175.91 0 0 1 317-56.94l-101.46-4.86a12 12 0 0 0-12.57 12v47.41a12 12 0 0 0 12 12H500a12 12 0 0 0 12-12V12a12 12 0 0 0-12-12h-47.37a12 12 0 0 0-11.98 12.57zM255.83 432a175.61 175.61 0 0 1-146-77.8l101.8 4.87a12 12 0 0 0 12.57-12v-47.4a12 12 0 0 0-12-12H12a12 12 0 0 0-12 12V500a12 12 0 0 0 12 12h47.35a12 12 0 0 0 12-12.6l-4.15-82.57A247.17 247.17 0 0 0 255.83 504c121.11 0 221.93-86.92 243.55-201.82a12 12 0 0 0-11.8-14.18h-49.05a12 12 0 0 0-11.67 9.26A175.86 175.86 0 0 1 255.83 432z"},"child":[]}]})(props);
}function FaStop (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 448 512"},"child":[{"tag":"path","attr":{"d":"M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48z"},"child":[]}]})(props);
}function FaShieldAlt (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M466.5 83.7l-192-80a48.15 48.15 0 0 0-36.9 0l-192 80C27.7 91.1 16 108.6 16 128c0 198.5 114.5 335.7 221.5 380.3 11.8 4.9 25.1 4.9 36.9 0C360.1 472.6 496 349.3 496 128c0-19.4-11.7-36.9-29.5-44.3zM256.1 446.3l-.1-381 175.9 73.3c-3.3 151.4-82.1 261.1-175.8 307.7z"},"child":[]}]})(props);
}function FaPlay (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 448 512"},"child":[{"tag":"path","attr":{"d":"M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"},"child":[]}]})(props);
}function FaMicrochip (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M416 48v416c0 26.51-21.49 48-48 48H144c-26.51 0-48-21.49-48-48V48c0-26.51 21.49-48 48-48h224c26.51 0 48 21.49 48 48zm96 58v12a6 6 0 0 1-6 6h-18v6a6 6 0 0 1-6 6h-42V88h42a6 6 0 0 1 6 6v6h18a6 6 0 0 1 6 6zm0 96v12a6 6 0 0 1-6 6h-18v6a6 6 0 0 1-6 6h-42v-48h42a6 6 0 0 1 6 6v6h18a6 6 0 0 1 6 6zm0 96v12a6 6 0 0 1-6 6h-18v6a6 6 0 0 1-6 6h-42v-48h42a6 6 0 0 1 6 6v6h18a6 6 0 0 1 6 6zm0 96v12a6 6 0 0 1-6 6h-18v6a6 6 0 0 1-6 6h-42v-48h42a6 6 0 0 1 6 6v6h18a6 6 0 0 1 6 6zM30 376h42v48H30a6 6 0 0 1-6-6v-6H6a6 6 0 0 1-6-6v-12a6 6 0 0 1 6-6h18v-6a6 6 0 0 1 6-6zm0-96h42v48H30a6 6 0 0 1-6-6v-6H6a6 6 0 0 1-6-6v-12a6 6 0 0 1 6-6h18v-6a6 6 0 0 1 6-6zm0-96h42v48H30a6 6 0 0 1-6-6v-6H6a6 6 0 0 1-6-6v-12a6 6 0 0 1 6-6h18v-6a6 6 0 0 1 6-6zm0-96h42v48H30a6 6 0 0 1-6-6v-6H6a6 6 0 0 1-6-6v-12a6 6 0 0 1 6-6h18v-6a6 6 0 0 1 6-6z"},"child":[]}]})(props);
}function FaGamepad (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 640 512"},"child":[{"tag":"path","attr":{"d":"M480.07 96H160a160 160 0 1 0 114.24 272h91.52A160 160 0 1 0 480.07 96zM248 268a12 12 0 0 1-12 12h-52v52a12 12 0 0 1-12 12h-24a12 12 0 0 1-12-12v-52H84a12 12 0 0 1-12-12v-24a12 12 0 0 1 12-12h52v-52a12 12 0 0 1 12-12h24a12 12 0 0 1 12 12v52h52a12 12 0 0 1 12 12zm216 76a40 40 0 1 1 40-40 40 40 0 0 1-40 40zm64-96a40 40 0 1 1 40-40 40 40 0 0 1-40 40z"},"child":[]}]})(props);
}function FaFolderOpen (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 576 512"},"child":[{"tag":"path","attr":{"d":"M572.694 292.093L500.27 416.248A63.997 63.997 0 0 1 444.989 448H45.025c-18.523 0-30.064-20.093-20.731-36.093l72.424-124.155A64 64 0 0 1 152 256h399.964c18.523 0 30.064 20.093 20.73 36.093zM152 224h328v-48c0-26.51-21.49-48-48-48H272l-64-64H48C21.49 64 0 85.49 0 112v278.046l69.077-118.418C86.214 242.25 117.989 224 152 224z"},"child":[]}]})(props);
}function FaFileArchive (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 384 512"},"child":[{"tag":"path","attr":{"d":"M377 105L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1c0-6.3-2.5-12.4-7-16.9zM128.4 336c-17.9 0-32.4 12.1-32.4 27 0 15 14.6 27 32.5 27s32.4-12.1 32.4-27-14.6-27-32.5-27zM224 136V0h-63.6v32h-32V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zM95.9 32h32v32h-32zm32.3 384c-33.2 0-58-30.4-51.4-62.9L96.4 256v-32h32v-32h-32v-32h32v-32h-32V96h32V64h32v32h-32v32h32v32h-32v32h32v32h-32v32h22.1c5.7 0 10.7 4.1 11.8 9.7l17.3 87.7c6.4 32.4-18.4 62.6-51.4 62.6z"},"child":[]}]})(props);
}function FaExclamationTriangle (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 576 512"},"child":[{"tag":"path","attr":{"d":"M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"},"child":[]}]})(props);
}function FaCheck (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"},"child":[]}]})(props);
}function FaCheckCircle (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"},"child":[]}]})(props);
}

const StatusCard = ({ status, onRefresh }) => {
    if (!status) {
        return (jsxRuntimeExports.jsx(PanelSection, { title: "System & Module Status", children: jsxRuntimeExports.jsx(PanelSectionRow, { children: jsxRuntimeExports.jsx(Field, { label: "Loading system info...", children: jsxRuntimeExports.jsx(FaSync, { className: "animate-spin" }) }) }) }));
    }
    const renderBadge = () => {
        switch (status.status_str) {
            case "RUNNING":
                return (jsxRuntimeExports.jsxs("span", { style: { color: "#4ade80", fontWeight: "bold", display: "flex", alignItems: "center", gap: "6px" }, children: [jsxRuntimeExports.jsx(FaCheckCircle, {}), " Running"] }));
            case "STOPPED":
                return (jsxRuntimeExports.jsxs("span", { style: { color: "#facc15", fontWeight: "bold", display: "flex", alignItems: "center", gap: "6px" }, children: [jsxRuntimeExports.jsx(FaExclamationTriangle, {}), " Stopped"] }));
            case "UPDATE_REQUIRED":
                return (jsxRuntimeExports.jsxs("span", { style: { color: "#f87171", fontWeight: "bold", display: "flex", alignItems: "center", gap: "6px" }, children: [jsxRuntimeExports.jsx(FaSync, {}), " Update Required (", status.kernel_release, ")"] }));
            default:
                return (jsxRuntimeExports.jsxs("span", { style: { color: "#9ca3af", fontWeight: "bold", display: "flex", alignItems: "center", gap: "6px" }, children: [jsxRuntimeExports.jsx(FaTimesCircle, {}), " Not Installed"] }));
        }
    };
    return (jsxRuntimeExports.jsxs(PanelSection, { title: "System & Module Status", children: [jsxRuntimeExports.jsx(PanelSectionRow, { children: jsxRuntimeExports.jsx(Field, { label: "Gaming OS", children: jsxRuntimeExports.jsx("span", { style: { textTransform: "capitalize", fontWeight: 600 }, children: status.os_type }) }) }), jsxRuntimeExports.jsx(PanelSectionRow, { children: jsxRuntimeExports.jsx(Field, { label: "Kernel Version", children: jsxRuntimeExports.jsx("span", { children: status.kernel_release }) }) }), jsxRuntimeExports.jsx(PanelSectionRow, { children: jsxRuntimeExports.jsx(Field, { label: "Module Status", children: renderBadge() }) }), jsxRuntimeExports.jsx(PanelSectionRow, { children: jsxRuntimeExports.jsx(Field, { label: "UMIP (clearcpuid=514)", children: status.umip_disabled ? (jsxRuntimeExports.jsx("span", { style: { color: "#4ade80" }, children: "Disabled" })) : (jsxRuntimeExports.jsx("span", { style: { color: "#facc15" }, children: "Enabled (Default)" })) }) }), status.native_support && (jsxRuntimeExports.jsx(PanelSectionRow, { children: jsxRuntimeExports.jsx("div", { style: { padding: "8px", background: "rgba(59, 130, 246, 0.1)", borderRadius: "6px", fontSize: "12px" }, children: "\uD83D\uDCA1 Your CPU natively supports CPUID faulting. Kernel module is optional." }) }))] }));
};

const ZipSelector = ({ serverAPI, sourceExists, onRefresh, onLogMsg }) => {
    const [zipList, setZipList] = reactExports.useState([]);
    const [selectedPath, setSelectedPath] = reactExports.useState("");
    const [loading, setLoading] = reactExports.useState(false);
    const scanZips = async () => {
        try {
            const res = await serverAPI.callPluginMethod("scan_for_zips", {});
            if (res.result && Array.isArray(res.result)) {
                setZipList(res.result);
                if (res.result.length > 0 && !selectedPath) {
                    setSelectedPath(res.result[0].path);
                }
            }
        }
        catch (e) {
            console.error("Failed to scan zips:", e);
        }
    };
    reactExports.useEffect(() => {
        scanZips();
    }, []);
    const handleOpenDolphin = async () => {
        setLoading(true);
        try {
            const res = await serverAPI.callPluginMethod("open_in_dolphin", { target_path: selectedPath });
            if (res.result) {
                onLogMsg(res.result.message);
            }
        }
        catch (e) {
            onLogMsg(`Error opening Dolphin: ${e.message || e}`);
        }
        finally {
            setLoading(false);
        }
    };
    const handleExtractZip = async () => {
        if (!selectedPath) {
            onLogMsg("Please select or enter a path to cpuid_fault_emulation.zip");
            return;
        }
        setLoading(true);
        try {
            const res = await serverAPI.callPluginMethod("extract_cpuid_zip", { zip_path: selectedPath });
            if (res.result) {
                onLogMsg(res.result.message);
                if (res.result.success) {
                    onRefresh();
                }
            }
        }
        catch (e) {
            onLogMsg(`Extraction error: ${e.message || e}`);
        }
        finally {
            setLoading(false);
        }
    };
    return (jsxRuntimeExports.jsxs(PanelSection, { title: "CPUID Emulation Source (.zip)", children: [jsxRuntimeExports.jsx(PanelSectionRow, { children: jsxRuntimeExports.jsx(Field, { label: "Source Folder State", children: sourceExists ? (jsxRuntimeExports.jsx("span", { style: { color: "#4ade80", fontWeight: 600 }, children: "Source Available" })) : (jsxRuntimeExports.jsx("span", { style: { color: "#f87171", fontWeight: 600 }, children: "Source Missing" })) }) }), zipList.length > 0 && (jsxRuntimeExports.jsx(PanelSectionRow, { children: jsxRuntimeExports.jsx(DropdownItem, { label: "Scanned Zip Files", rgOptions: zipList.map((z) => ({
                        data: z.path,
                        label: `${z.name} (${(z.size / 1024 / 1024).toFixed(1)} MB)`
                    })), selectedOption: selectedPath, onChange: (opt) => setSelectedPath(opt.data) }) })), jsxRuntimeExports.jsx(PanelSectionRow, { children: jsxRuntimeExports.jsx(TextField, { label: "Zip Archive Path", value: selectedPath, onChange: (e) => setSelectedPath(e.target.value) }) }), jsxRuntimeExports.jsx(PanelSectionRow, { children: jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: "8px", width: "100%" }, children: jsxRuntimeExports.jsx(ButtonItem, { layout: "below", disabled: loading, onClick: handleOpenDolphin, children: jsxRuntimeExports.jsxs("span", { style: { display: "flex", alignItems: "center", gap: "6px" }, children: [jsxRuntimeExports.jsx(FaFolderOpen, {}), " Open Location in Dolphin"] }) }) }) }), jsxRuntimeExports.jsx(PanelSectionRow, { children: jsxRuntimeExports.jsx(ButtonItem, { layout: "below", disabled: loading || !selectedPath, onClick: handleExtractZip, children: jsxRuntimeExports.jsxs("span", { style: { display: "flex", alignItems: "center", gap: "6px" }, children: [jsxRuntimeExports.jsx(FaFileArchive, {}), " Extract & Prepare Zip"] }) }) })] }));
};

const ModuleActions = ({ serverAPI, status, onRefresh, onLogMsg }) => {
    const [working, setWorking] = reactExports.useState(false);
    const isLoaded = status?.is_loaded;
    const isInstalled = status?.is_installed;
    const vermagicMatch = status?.vermagic_match;
    const sourceExists = status?.source_exists;
    const osType = status?.os_type;
    const handleStart = async () => {
        setWorking(true);
        onLogMsg("Starting cpuid_fault_emulation module...");
        try {
            const res = await serverAPI.callPluginMethod("start_module", {});
            if (res.result) {
                onLogMsg(res.result.message);
            }
        }
        catch (e) {
            onLogMsg(`Start error: ${e.message || e}`);
        }
        finally {
            setWorking(false);
            onRefresh();
        }
    };
    const handleStop = async () => {
        setWorking(true);
        onLogMsg("Stopping cpuid_fault_emulation module...");
        try {
            const res = await serverAPI.callPluginMethod("stop_module", {});
            if (res.result) {
                onLogMsg(res.result.message);
            }
        }
        catch (e) {
            onLogMsg(`Stop error: ${e.message || e}`);
        }
        finally {
            setWorking(false);
            onRefresh();
        }
    };
    const handleBuild = async () => {
        setWorking(true);
        onLogMsg(`Initiating module build for ${osType || "system"}...`);
        try {
            const res = await serverAPI.callPluginMethod("build_and_install_module", {});
            if (res.result) {
                onLogMsg(res.result.message);
            }
        }
        catch (e) {
            onLogMsg(`Build error: ${e.message || e}`);
        }
        finally {
            setWorking(false);
            onRefresh();
        }
    };
    const handleUninstall = () => {
        showModal(jsxRuntimeExports.jsx(ConfirmModal, { strTitle: "Uninstall CPUID Module?", strDescription: "Are you sure you want to stop and remove the cpuid_fault_emulation kernel module?", onOK: async () => {
                setWorking(true);
                onLogMsg("Uninstalling module...");
                try {
                    const res = await serverAPI.callPluginMethod("uninstall_module", {});
                    if (res.result) {
                        onLogMsg(res.result.message);
                    }
                }
                catch (e) {
                    onLogMsg(`Uninstall error: ${e.message || e}`);
                }
                finally {
                    setWorking(false);
                    onRefresh();
                }
            } }));
    };
    return (jsxRuntimeExports.jsxs(PanelSection, { title: "Module Controls", children: [jsxRuntimeExports.jsx(PanelSectionRow, { children: jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "8px", width: "100%" }, children: [jsxRuntimeExports.jsx(ButtonItem, { layout: "below", disabled: working || isLoaded || !isInstalled || !vermagicMatch, onClick: handleStart, children: jsxRuntimeExports.jsxs("span", { style: { display: "flex", alignItems: "center", gap: "6px", color: "#4ade80" }, children: [jsxRuntimeExports.jsx(FaPlay, {}), " Start Module"] }) }), jsxRuntimeExports.jsx(ButtonItem, { layout: "below", disabled: working || !isLoaded, onClick: handleStop, children: jsxRuntimeExports.jsxs("span", { style: { display: "flex", alignItems: "center", gap: "6px", color: "#f87171" }, children: [jsxRuntimeExports.jsx(FaStop, {}), " Stop Module"] }) })] }) }), jsxRuntimeExports.jsx(PanelSectionRow, { children: jsxRuntimeExports.jsx(ButtonItem, { layout: "below", disabled: working || !sourceExists, onClick: handleBuild, children: jsxRuntimeExports.jsxs("span", { style: { display: "flex", alignItems: "center", gap: "6px" }, children: [jsxRuntimeExports.jsx(FaTools, {}), " ", isInstalled && !vermagicMatch ? `Rebuild for Kernel ${status?.kernel_release}` : "Build & Install Module"] }) }) }), isInstalled && (jsxRuntimeExports.jsx(PanelSectionRow, { children: jsxRuntimeExports.jsx(ButtonItem, { layout: "below", disabled: working, onClick: handleUninstall, children: jsxRuntimeExports.jsxs("span", { style: { display: "flex", alignItems: "center", gap: "6px", color: "#9ca3af" }, children: [jsxRuntimeExports.jsx(FaTrash, {}), " Uninstall Module"] }) }) }))] }));
};

const HvGamesCard = ({ serverAPI, onLogMsg }) => {
    const [shortcuts, setShortcuts] = reactExports.useState([]);
    const [selectedAppIds, setSelectedAppIds] = reactExports.useState(new Set());
    const [watcherStatus, setWatcherStatus] = reactExports.useState({
        configured: false,
        active: false,
        appids: []
    });
    const [loading, setLoading] = reactExports.useState(false);
    const fetchData = async () => {
        try {
            const [shortcutsRes, statusRes] = await Promise.all([
                serverAPI.callPluginMethod("get_steam_shortcuts", {}),
                serverAPI.callPluginMethod("get_hv_games_status", {})
            ]);
            if (shortcutsRes.result) {
                setShortcuts(shortcutsRes.result);
            }
            if (statusRes.result) {
                setWatcherStatus(statusRes.result);
                setSelectedAppIds(new Set(statusRes.result.appids || []));
            }
        }
        catch (e) {
            console.error("Failed to load HV games data:", e);
        }
    };
    reactExports.useEffect(() => {
        fetchData();
    }, []);
    const toggleAppId = (appid) => {
        const next = new Set(selectedAppIds);
        if (next.has(appid)) {
            next.delete(appid);
        }
        else {
            next.add(appid);
        }
        setSelectedAppIds(next);
    };
    const handleApplyConfig = async () => {
        if (selectedAppIds.size === 0) {
            onLogMsg("Please select at least one game shortcut.");
            return;
        }
        setLoading(true);
        try {
            const res = await serverAPI.callPluginMethod("configure_hv_games", { appids: Array.from(selectedAppIds) });
            if (res.result) {
                onLogMsg(res.result.message);
                fetchData();
            }
        }
        catch (e) {
            onLogMsg(`Configuration error: ${e.message || e}`);
        }
        finally {
            setLoading(false);
        }
    };
    const handleDisableWatcher = async () => {
        setLoading(true);
        try {
            const res = await serverAPI.callPluginMethod("disable_hv_games", {});
            if (res.result) {
                onLogMsg(res.result.message);
                fetchData();
            }
        }
        catch (e) {
            onLogMsg(`Disable error: ${e.message || e}`);
        }
        finally {
            setLoading(false);
        }
    };
    return (jsxRuntimeExports.jsxs(PanelSection, { title: "HV Games Automator", children: [jsxRuntimeExports.jsx(PanelSectionRow, { children: jsxRuntimeExports.jsx(Field, { label: "Watcher Status", children: watcherStatus.active ? (jsxRuntimeExports.jsxs("span", { style: { color: "#4ade80", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }, children: [jsxRuntimeExports.jsx(FaCheckCircle, {}), " Active (", watcherStatus.appids.length, " game(s))"] })) : watcherStatus.configured ? (jsxRuntimeExports.jsxs("span", { style: { color: "#facc15", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }, children: [jsxRuntimeExports.jsx(FaTimesCircle, {}), " Service Inactive"] })) : (jsxRuntimeExports.jsx("span", { style: { color: "#9ca3af" }, children: "Disabled" })) }) }), shortcuts.length === 0 ? (jsxRuntimeExports.jsx(PanelSectionRow, { children: jsxRuntimeExports.jsx("div", { style: { padding: "8px", fontSize: "12px", color: "#9ca3af" }, children: "No non-Steam game shortcuts found in Steam shortcuts.vdf files." }) })) : (jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [jsxRuntimeExports.jsx(PanelSectionRow, { children: jsxRuntimeExports.jsx("div", { style: { fontSize: "12px", color: "#d1d5db", marginBottom: "4px" }, children: "Select shortcuts to automatically start/stop the CPUID module on launch/exit:" }) }), shortcuts.map((sc) => (jsxRuntimeExports.jsx(PanelSectionRow, { children: jsxRuntimeExports.jsx(ToggleField, { label: sc.name, description: `AppID: ${sc.appid}`, checked: selectedAppIds.has(sc.appid), onChange: () => toggleAppId(sc.appid) }) }, sc.appid))), jsxRuntimeExports.jsx(PanelSectionRow, { children: jsxRuntimeExports.jsx(ButtonItem, { layout: "below", disabled: loading || selectedAppIds.size === 0, onClick: handleApplyConfig, children: jsxRuntimeExports.jsxs("span", { style: { display: "flex", alignItems: "center", gap: "6px" }, children: [jsxRuntimeExports.jsx(FaGamepad, {}), " Save & Enable HV Watcher (", selectedAppIds.size, ")"] }) }) })] })), watcherStatus.configured && (jsxRuntimeExports.jsx(PanelSectionRow, { children: jsxRuntimeExports.jsx(ButtonItem, { layout: "below", disabled: loading, onClick: handleDisableWatcher, children: jsxRuntimeExports.jsx("span", { style: { color: "#f87171" }, children: "Disable Watcher" }) }) }))] }));
};

const UmipCard = ({ serverAPI, umipDisabled, onRefresh, onLogMsg }) => {
    const [loading, setLoading] = reactExports.useState(false);
    const handleDisableUmip = async () => {
        setLoading(true);
        onLogMsg("Adding clearcpuid=514 to kernel arguments...");
        try {
            const res = await serverAPI.callPluginMethod("disable_umip", {});
            if (res.result) {
                onLogMsg(res.result.message);
                onRefresh();
            }
        }
        catch (e) {
            onLogMsg(`UMIP configuration error: ${e.message || e}`);
        }
        finally {
            setLoading(false);
        }
    };
    return (jsxRuntimeExports.jsxs(PanelSection, { title: "UMIP Kernel Argument", children: [jsxRuntimeExports.jsx(PanelSectionRow, { children: jsxRuntimeExports.jsx(Field, { label: "clearcpuid=514 State", children: umipDisabled ? (jsxRuntimeExports.jsxs("span", { style: { color: "#4ade80", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }, children: [jsxRuntimeExports.jsx(FaCheck, {}), " UMIP Disabled (Present)"] })) : (jsxRuntimeExports.jsxs("span", { style: { color: "#facc15", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }, children: [jsxRuntimeExports.jsx(FaExclamationTriangle, {}), " Default (UMIP Active)"] })) }) }), !umipDisabled && (jsxRuntimeExports.jsx(PanelSectionRow, { children: jsxRuntimeExports.jsx(ButtonItem, { layout: "below", disabled: loading, onClick: handleDisableUmip, children: jsxRuntimeExports.jsxs("span", { style: { display: "flex", alignItems: "center", gap: "6px" }, children: [jsxRuntimeExports.jsx(FaShieldAlt, {}), " Disable UMIP (rpm-ostree kargs)"] }) }) })), jsxRuntimeExports.jsx(PanelSectionRow, { children: jsxRuntimeExports.jsxs("div", { style: { fontSize: "11px", color: "#9ca3af" }, children: ["Disabling UMIP appends ", jsxRuntimeExports.jsx("code", { children: "clearcpuid=514" }), " to Bazzite kernel args, allowing instructions like ", jsxRuntimeExports.jsx("code", { children: "SIDT" }), "/", jsxRuntimeExports.jsx("code", { children: "SGDT" }), " to be emulated without triggering access faults. Requires a reboot after applying."] }) })] }));
};

if (typeof window !== "undefined" && typeof window.process === "undefined") {
    window.process = { env: { NODE_ENV: "production" } };
}
const Content = ({ serverAPI }) => {
    const [status, setStatus] = reactExports.useState(null);
    const [logMsg, setLogMsg] = reactExports.useState("");
    const refreshStatus = async () => {
        try {
            const res = await serverAPI.callPluginMethod("get_system_status", {});
            if (res.result) {
                setStatus(res.result);
            }
        }
        catch (e) {
            console.error("Failed to fetch system status:", e);
        }
    };
    reactExports.useEffect(() => {
        refreshStatus();
        const interval = setInterval(refreshStatus, 8000);
        return () => clearInterval(interval);
    }, []);
    return (jsxRuntimeExports.jsxs("div", { style: { padding: "4px 0" }, children: [jsxRuntimeExports.jsx(StatusCard, { status: status, onRefresh: refreshStatus }), logMsg && (jsxRuntimeExports.jsx("div", { style: {
                    margin: "8px 12px",
                    padding: "8px 12px",
                    background: "rgba(30, 41, 59, 0.9)",
                    borderLeft: "4px solid #3b82f6",
                    borderRadius: "4px",
                    fontSize: "12px",
                    color: "#e2e8f0",
                    wordBreak: "break-word"
                }, children: logMsg })), jsxRuntimeExports.jsx(ModuleActions, { serverAPI: serverAPI, status: status, onRefresh: refreshStatus, onLogMsg: setLogMsg }), jsxRuntimeExports.jsx(ZipSelector, { serverAPI: serverAPI, sourceExists: status?.source_exists || false, onRefresh: refreshStatus, onLogMsg: setLogMsg }), jsxRuntimeExports.jsx(HvGamesCard, { serverAPI: serverAPI, onLogMsg: setLogMsg }), jsxRuntimeExports.jsx(UmipCard, { serverAPI: serverAPI, umipDisabled: status?.umip_disabled || false, onRefresh: refreshStatus, onLogMsg: setLogMsg })] }));
};
var index = definePlugin((serverAPI) => {
    return {
        title: jsxRuntimeExports.jsx("div", { className: staticClasses.Title, children: "CPUID & HV Controls" }),
        icon: jsxRuntimeExports.jsx(FaMicrochip, {}),
        content: jsxRuntimeExports.jsx(Content, { serverAPI: serverAPI }),
        onDismount() { }
    };
});

export { index as default };
