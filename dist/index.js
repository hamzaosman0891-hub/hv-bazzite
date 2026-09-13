var DefaultContext = {
  color: undefined,
  size: undefined,
  className: undefined,
  style: undefined,
  attr: undefined
};
var IconContext = SP_REACT.createContext && /*#__PURE__*/SP_REACT.createContext(DefaultContext);

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
  return tree && tree.map((node, i) => /*#__PURE__*/SP_REACT.createElement(node.tag, _objectSpread({
    key: i
  }, node.attr), Tree2Element(node.child)));
}
function GenIcon(data) {
  return props => /*#__PURE__*/SP_REACT.createElement(IconBase, _extends({
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
    return /*#__PURE__*/SP_REACT.createElement("svg", _extends({
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
    }), title && /*#__PURE__*/SP_REACT.createElement("title", null, title), props.children);
  };
  return IconContext !== undefined ? /*#__PURE__*/SP_REACT.createElement(IconContext.Consumer, null, conf => elem(conf)) : elem(DefaultContext);
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
}function FaSearch (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"},"child":[]}]})(props);
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

const manifest = {"name":"CPUID Emulation & HV Controls","author":"Pareidolia","version":"1.0.0","flags":["root"],"api_version":1};
const API_VERSION = 2;
const internalAPIConnection = window.__DECKY_SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED_deckyLoaderAPIInit;
if (!internalAPIConnection) {
    throw new Error('[@decky/api]: Failed to connect to the loader as as the loader API was not initialized. This is likely a bug in Decky Loader.');
}
let api;
try {
    api = internalAPIConnection.connect(API_VERSION, manifest.name);
}
catch {
    api = internalAPIConnection.connect(1, manifest.name);
    console.warn(`[@decky/api] Requested API version ${API_VERSION} but the running loader only supports version 1. Some features may not work.`);
}
if (api._version != API_VERSION) {
    console.warn(`[@decky/api] Requested API version ${API_VERSION} but the running loader only supports version ${api._version}. Some features may not work.`);
}
const callable = api.callable;

const getSystemStatus = callable("get_system_status");
const scanForZips = callable("scan_for_zips");
const openInDolphin = callable("open_in_dolphin");
const extractCpuidZip = callable("extract_cpuid_zip");
const buildAndInstallModule = callable("build_and_install_module");
const startModule = callable("start_module");
const stopModule = callable("stop_module");
const disableUmip = callable("disable_umip");
const uninstallModule = callable("uninstall_module");
const getSteamShortcuts = callable("get_steam_shortcuts");
const getHvGamesStatus = callable("get_hv_games_status");
const configureHvGames = callable("configure_hv_games");
const disableHvGames = callable("disable_hv_games");
const getPatchableGames = callable("get_patchable_games");
const findGameShippingExe = callable("find_game_shipping_exe");
const scanForPatches = callable("scan_for_patches");
const applyHvPatch = callable("apply_hv_patch");

const StatusCard = ({ status, onRefresh }) => {
    if (!status) {
        return (SP_JSX.jsx(DFL.PanelSection, { title: "System & Module Status", children: SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.Field, { label: "Loading system info...", children: SP_JSX.jsx(FaSync, { className: "animate-spin" }) }) }) }));
    }
    const renderBadge = () => {
        switch (status.status_str) {
            case "RUNNING":
                return (SP_JSX.jsxs("span", { style: { color: "#4ade80", fontWeight: "bold", display: "flex", alignItems: "center", gap: "6px" }, children: [SP_JSX.jsx(FaCheckCircle, {}), " Running"] }));
            case "STOPPED":
                return (SP_JSX.jsxs("span", { style: { color: "#facc15", fontWeight: "bold", display: "flex", alignItems: "center", gap: "6px" }, children: [SP_JSX.jsx(FaExclamationTriangle, {}), " Stopped"] }));
            case "UPDATE_REQUIRED":
                return (SP_JSX.jsxs("span", { style: { color: "#f87171", fontWeight: "bold", display: "flex", alignItems: "center", gap: "6px" }, children: [SP_JSX.jsx(FaSync, {}), " Update Required (", status.kernel_release, ")"] }));
            default:
                return (SP_JSX.jsxs("span", { style: { color: "#9ca3af", fontWeight: "bold", display: "flex", alignItems: "center", gap: "6px" }, children: [SP_JSX.jsx(FaTimesCircle, {}), " Not Installed"] }));
        }
    };
    return (SP_JSX.jsxs(DFL.PanelSection, { title: "System & Module Status", children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.Field, { label: "Gaming OS", children: SP_JSX.jsx("span", { style: { textTransform: "capitalize", fontWeight: 600 }, children: status.os_type }) }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.Field, { label: "Kernel Version", children: SP_JSX.jsx("span", { children: status.kernel_release }) }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.Field, { label: "Module Status", children: renderBadge() }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.Field, { label: "UMIP (clearcpuid=514)", children: status.umip_disabled ? (SP_JSX.jsx("span", { style: { color: "#4ade80" }, children: "Disabled" })) : (SP_JSX.jsx("span", { style: { color: "#facc15" }, children: "Enabled (Default)" })) }) }), status.native_support && (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx("div", { style: { padding: "8px", background: "rgba(59, 130, 246, 0.1)", borderRadius: "6px", fontSize: "12px" }, children: "\uD83D\uDCA1 Your CPU natively supports CPUID faulting. Kernel module is optional." }) }))] }));
};

const ZipSelector = ({ sourceExists, onRefresh, onLogMsg }) => {
    const [zipList, setZipList] = SP_REACT.useState([]);
    const [selectedPath, setSelectedPath] = SP_REACT.useState("");
    const [loading, setLoading] = SP_REACT.useState(false);
    const scanZips = async () => {
        try {
            const res = await scanForZips();
            if (res && Array.isArray(res)) {
                setZipList(res);
                if (res.length > 0 && !selectedPath) {
                    setSelectedPath(res[0].path);
                }
            }
        }
        catch (e) {
            console.error("Failed to scan zips:", e);
        }
    };
    SP_REACT.useEffect(() => {
        scanZips();
    }, []);
    const handleOpenDolphin = async () => {
        setLoading(true);
        try {
            const res = await openInDolphin(selectedPath);
            if (res) {
                onLogMsg(res.message);
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
            const res = await extractCpuidZip(selectedPath);
            if (res) {
                onLogMsg(res.message);
                if (res.success) {
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
    return (SP_JSX.jsxs(DFL.PanelSection, { title: "CPUID Emulation Source (.zip)", children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.Field, { label: "Source Folder State", children: sourceExists ? (SP_JSX.jsx("span", { style: { color: "#4ade80", fontWeight: 600 }, children: "Source Available" })) : (SP_JSX.jsx("span", { style: { color: "#f87171", fontWeight: 600 }, children: "Source Missing" })) }) }), zipList.length > 0 && (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.DropdownItem, { label: "Scanned Zip Files", rgOptions: zipList.map((z) => ({
                        data: z.path,
                        label: `${z.name} (${(z.size / 1024 / 1024).toFixed(1)} MB)`
                    })), selectedOption: selectedPath, onChange: (opt) => setSelectedPath(opt.data) }) })), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.TextField, { label: "Zip Archive Path", value: selectedPath, onChange: (e) => setSelectedPath(e.target.value) }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx("div", { style: { display: "flex", gap: "8px", width: "100%" }, children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", disabled: loading, onClick: handleOpenDolphin, children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", gap: "6px" }, children: [SP_JSX.jsx(FaFolderOpen, {}), " Open Location in Dolphin"] }) }) }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", disabled: loading || !selectedPath, onClick: handleExtractZip, children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", gap: "6px" }, children: [SP_JSX.jsx(FaFileArchive, {}), " Extract & Prepare Zip"] }) }) })] }));
};

const ModuleActions = ({ status, onRefresh, onLogMsg }) => {
    const [working, setWorking] = SP_REACT.useState(false);
    const isLoaded = status?.is_loaded;
    const isInstalled = status?.is_installed;
    const vermagicMatch = status?.vermagic_match;
    const sourceExists = status?.source_exists;
    const osType = status?.os_type;
    const handleStart = async () => {
        setWorking(true);
        onLogMsg("Starting cpuid_fault_emulation module...");
        try {
            const res = await startModule();
            if (res) {
                onLogMsg(res.message);
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
            const res = await stopModule();
            if (res) {
                onLogMsg(res.message);
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
            const res = await buildAndInstallModule();
            if (res) {
                onLogMsg(res.message);
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
        DFL.showModal(SP_JSX.jsx(DFL.ConfirmModal, { strTitle: "Uninstall CPUID Module?", strDescription: "Are you sure you want to stop and remove the cpuid_fault_emulation kernel module?", onOK: async () => {
                setWorking(true);
                onLogMsg("Uninstalling module...");
                try {
                    const res = await uninstallModule();
                    if (res) {
                        onLogMsg(res.message);
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
    return (SP_JSX.jsxs(DFL.PanelSection, { title: "Module Controls", children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsxs("div", { style: { display: "flex", gap: "8px", width: "100%" }, children: [SP_JSX.jsx(DFL.ButtonItem, { layout: "below", disabled: working || isLoaded || !isInstalled || !vermagicMatch, onClick: handleStart, children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", gap: "6px", color: "#4ade80" }, children: [SP_JSX.jsx(FaPlay, {}), " Start Module"] }) }), SP_JSX.jsx(DFL.ButtonItem, { layout: "below", disabled: working || !isLoaded, onClick: handleStop, children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", gap: "6px", color: "#f87171" }, children: [SP_JSX.jsx(FaStop, {}), " Stop Module"] }) })] }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", disabled: working || !sourceExists, onClick: handleBuild, children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", gap: "6px" }, children: [SP_JSX.jsx(FaTools, {}), " ", isInstalled && !vermagicMatch ? `Rebuild for Kernel ${status?.kernel_release}` : "Build & Install Module"] }) }) }), isInstalled && (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", disabled: working, onClick: handleUninstall, children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", gap: "6px", color: "#9ca3af" }, children: [SP_JSX.jsx(FaTrash, {}), " Uninstall Module"] }) }) }))] }));
};

const HvGamesCard = ({ onLogMsg }) => {
    const [shortcuts, setShortcuts] = SP_REACT.useState([]);
    const [selectedAppIds, setSelectedAppIds] = SP_REACT.useState(new Set());
    const [watcherStatus, setWatcherStatus] = SP_REACT.useState({
        configured: false,
        active: false,
        appids: []
    });
    const [loading, setLoading] = SP_REACT.useState(false);
    const fetchData = async () => {
        try {
            const [shortcutsRes, statusRes] = await Promise.all([
                getSteamShortcuts(),
                getHvGamesStatus()
            ]);
            if (shortcutsRes) {
                setShortcuts(shortcutsRes);
            }
            if (statusRes) {
                setWatcherStatus(statusRes);
                setSelectedAppIds(new Set(statusRes.appids || []));
            }
        }
        catch (e) {
            console.error("Failed to load HV games data:", e);
        }
    };
    SP_REACT.useEffect(() => {
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
            const res = await configureHvGames(Array.from(selectedAppIds));
            if (res) {
                onLogMsg(res.message);
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
            const res = await disableHvGames();
            if (res) {
                onLogMsg(res.message);
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
    return (SP_JSX.jsxs(DFL.PanelSection, { title: "HV Games Automator", children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.Field, { label: "Watcher Status", children: watcherStatus.active ? (SP_JSX.jsxs("span", { style: { color: "#4ade80", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }, children: [SP_JSX.jsx(FaCheckCircle, {}), " Active (", watcherStatus.appids.length, " game(s))"] })) : watcherStatus.configured ? (SP_JSX.jsxs("span", { style: { color: "#facc15", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }, children: [SP_JSX.jsx(FaTimesCircle, {}), " Service Inactive"] })) : (SP_JSX.jsx("span", { style: { color: "#9ca3af" }, children: "Disabled" })) }) }), shortcuts.length === 0 ? (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx("div", { style: { padding: "8px", fontSize: "12px", color: "#9ca3af" }, children: "No non-Steam game shortcuts found in Steam shortcuts.vdf files." }) })) : (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx("div", { style: { fontSize: "12px", color: "#d1d5db", marginBottom: "4px" }, children: "Select shortcuts to automatically start/stop the CPUID module on launch/exit:" }) }), shortcuts.map((sc) => (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ToggleField, { label: sc.name, description: `AppID: ${sc.appid}`, checked: selectedAppIds.has(sc.appid), onChange: () => toggleAppId(sc.appid) }) }, sc.appid))), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", disabled: loading || selectedAppIds.size === 0, onClick: handleApplyConfig, children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", gap: "6px" }, children: [SP_JSX.jsx(FaGamepad, {}), " Save & Enable HV Watcher (", selectedAppIds.size, ")"] }) }) })] })), watcherStatus.configured && (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", disabled: loading, onClick: handleDisableWatcher, children: SP_JSX.jsx("span", { style: { color: "#f87171" }, children: "Disable Watcher" }) }) }))] }));
};

const UmipCard = ({ umipDisabled, onRefresh, onLogMsg }) => {
    const [loading, setLoading] = SP_REACT.useState(false);
    const handleDisableUmip = async () => {
        setLoading(true);
        onLogMsg("Adding clearcpuid=514 to kernel arguments...");
        try {
            const res = await disableUmip();
            if (res) {
                onLogMsg(res.message);
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
    return (SP_JSX.jsxs(DFL.PanelSection, { title: "UMIP Kernel Argument", children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.Field, { label: "clearcpuid=514 State", children: umipDisabled ? (SP_JSX.jsxs("span", { style: { color: "#4ade80", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }, children: [SP_JSX.jsx(FaCheck, {}), " UMIP Disabled (Present)"] })) : (SP_JSX.jsxs("span", { style: { color: "#facc15", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }, children: [SP_JSX.jsx(FaExclamationTriangle, {}), " Default (UMIP Active)"] })) }) }), !umipDisabled && (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", disabled: loading, onClick: handleDisableUmip, children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", gap: "6px" }, children: [SP_JSX.jsx(FaShieldAlt, {}), " Disable UMIP (rpm-ostree kargs)"] }) }) })), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsxs("div", { style: { fontSize: "11px", color: "#9ca3af" }, children: ["Disabling UMIP appends ", SP_JSX.jsx("code", { children: "clearcpuid=514" }), " to Bazzite kernel args, allowing instructions like ", SP_JSX.jsx("code", { children: "SIDT" }), "/", SP_JSX.jsx("code", { children: "SGDT" }), " to be emulated without triggering access faults. Requires a reboot after applying."] }) })] }));
};

const fileName = (path) => path.split("/").pop() || path;
const PatchCard = ({ onLogMsg }) => {
    const [games, setGames] = SP_REACT.useState([]);
    const [selectedGameId, setSelectedGameId] = SP_REACT.useState("");
    const [exeCandidates, setExeCandidates] = SP_REACT.useState([]);
    const [selectedExe, setSelectedExe] = SP_REACT.useState("");
    const [searching, setSearching] = SP_REACT.useState(false);
    const [patches, setPatches] = SP_REACT.useState([]);
    const [patchPath, setPatchPath] = SP_REACT.useState("");
    const [applying, setApplying] = SP_REACT.useState(false);
    const loadLists = async () => {
        try {
            const [gamesRes, patchesRes] = await Promise.all([getPatchableGames(), scanForPatches()]);
            if (Array.isArray(gamesRes))
                setGames(gamesRes);
            if (Array.isArray(patchesRes)) {
                setPatches(patchesRes);
                if (patchesRes.length > 0 && !patchPath)
                    setPatchPath(patchesRes[0].path);
            }
        }
        catch (e) {
            console.error("Failed to load patch data:", e);
        }
    };
    SP_REACT.useEffect(() => {
        loadLists();
    }, []);
    const selectGame = async (gameId) => {
        setSelectedGameId(gameId);
        setExeCandidates([]);
        setSelectedExe("");
        const game = games.find((g) => g.id === gameId);
        if (!game)
            return;
        setSearching(true);
        onLogMsg(`Searching ${game.name} for *-Win64-Shipping.exe...`);
        try {
            const res = await findGameShippingExe(game.install_dir, game.exe || "");
            onLogMsg(res.message);
            if (res.success && res.candidates.length > 0) {
                setExeCandidates(res.candidates);
                setSelectedExe(res.candidates[0]);
            }
        }
        catch (e) {
            onLogMsg(`Search error: ${e.message || e}`);
        }
        finally {
            setSearching(false);
        }
    };
    const runApply = async () => {
        setApplying(true);
        onLogMsg(`Applying ${fileName(patchPath)}...`);
        try {
            const res = await applyHvPatch(selectedExe, patchPath);
            onLogMsg(res.message);
        }
        catch (e) {
            onLogMsg(`Patch error: ${e.message || e}`);
        }
        finally {
            setApplying(false);
        }
    };
    const handleApply = () => {
        const game = games.find((g) => g.id === selectedGameId);
        DFL.showModal(SP_JSX.jsx(DFL.ConfirmModal, { strTitle: "Apply HV Patch?", strDescription: `Extract ${fileName(patchPath)} into the folder of ${fileName(selectedExe)} for ${game?.name || "this game"}? Files that get overwritten are backed up to .hv_patch_backup first.`, onOK: runApply }));
    };
    const selectedExeDir = selectedExe ? selectedExe.substring(0, selectedExe.lastIndexOf("/")) : "";
    return (SP_JSX.jsxs(DFL.PanelSection, { title: "Custom HV Patch", children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.DropdownItem, { label: "Game", strDefaultLabel: games.length ? "Select a game" : "No installed games found", rgOptions: games.map((g) => ({
                        data: g.id,
                        label: `${g.name}${g.source === "non-steam" ? " (Non-Steam)" : ""}`
                    })), selectedOption: selectedGameId, onChange: (opt) => selectGame(opt.data) }) }), selectedGameId && (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.Field, { label: "Shipping EXE", children: searching ? (SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", gap: "6px", color: "#9ca3af" }, children: [SP_JSX.jsx(FaSearch, {}), " Searching..."] })) : selectedExe ? (SP_JSX.jsx("span", { style: { color: "#4ade80", fontWeight: 600, wordBreak: "break-all" }, children: fileName(selectedExe) })) : (SP_JSX.jsx("span", { style: { color: "#f87171", fontWeight: 600 }, children: "Not Found" })) }) })), exeCandidates.length > 1 && (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.DropdownItem, { label: "Multiple EXEs found", rgOptions: exeCandidates.map((c) => ({ data: c, label: c })), selectedOption: selectedExe, onChange: (opt) => setSelectedExe(opt.data) }) })), selectedExeDir && (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsxs("div", { style: { fontSize: "11px", color: "#9ca3af", wordBreak: "break-all" }, children: ["Target: ", selectedExeDir] }) })), patches.length > 0 && (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.DropdownItem, { label: "Patch Archive", rgOptions: patches.map((p) => ({
                        data: p.path,
                        label: `${p.name} (${(p.size / 1024 / 1024).toFixed(1)} MB)`
                    })), selectedOption: patchPath, onChange: (opt) => setPatchPath(opt.data) }) })), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.TextField, { label: "Patch Path (.zip / .7z)", value: patchPath, onChange: (e) => setPatchPath(e.target.value) }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", disabled: applying, onClick: loadLists, children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", gap: "6px" }, children: [SP_JSX.jsx(FaSync, {}), " Rescan Games & Patches"] }) }) }), selectedExeDir && (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", onClick: () => openInDolphin(selectedExeDir), children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", gap: "6px" }, children: [SP_JSX.jsx(FaFolderOpen, {}), " Open Game Folder in Dolphin"] }) }) })), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", disabled: applying || searching || !selectedExe || !patchPath, onClick: handleApply, children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", gap: "6px" }, children: [SP_JSX.jsx(FaFileArchive, {}), " ", applying ? "Applying Patch..." : "Apply Patch to Game"] }) }) })] }));
};

const Content = () => {
    const [status, setStatus] = SP_REACT.useState(null);
    const [logMsg, setLogMsg] = SP_REACT.useState("");
    const refreshStatus = async () => {
        try {
            const res = await getSystemStatus();
            if (res) {
                setStatus(res);
            }
        }
        catch (e) {
            console.error("Failed to fetch system status:", e);
        }
    };
    SP_REACT.useEffect(() => {
        refreshStatus();
        const interval = setInterval(refreshStatus, 8000);
        return () => clearInterval(interval);
    }, []);
    return (SP_JSX.jsxs("div", { style: { padding: "4px 0" }, children: [SP_JSX.jsx(StatusCard, { status: status, onRefresh: refreshStatus }), logMsg && (SP_JSX.jsx("div", { style: {
                    margin: "8px 12px",
                    padding: "8px 12px",
                    background: "rgba(30, 41, 59, 0.9)",
                    borderLeft: "4px solid #3b82f6",
                    borderRadius: "4px",
                    fontSize: "12px",
                    color: "#e2e8f0",
                    wordBreak: "break-word"
                }, children: logMsg })), SP_JSX.jsx(ModuleActions, { status: status, onRefresh: refreshStatus, onLogMsg: setLogMsg }), SP_JSX.jsx(ZipSelector, { sourceExists: status?.source_exists || false, onRefresh: refreshStatus, onLogMsg: setLogMsg }), SP_JSX.jsx(HvGamesCard, { onLogMsg: setLogMsg }), SP_JSX.jsx(PatchCard, { onLogMsg: setLogMsg }), SP_JSX.jsx(UmipCard, { umipDisabled: status?.umip_disabled || false, onRefresh: refreshStatus, onLogMsg: setLogMsg })] }));
};
var index = DFL.definePlugin(() => {
    return {
        title: SP_JSX.jsx("div", { className: DFL.staticClasses.Title, children: "CPUID & HV Controls" }),
        icon: SP_JSX.jsx(FaMicrochip, {}),
        content: SP_JSX.jsx(Content, {}),
        onDismount() { }
    };
});

export { index as default };
//# sourceMappingURL=index.js.map
