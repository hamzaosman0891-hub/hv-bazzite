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
function FaWrench (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M507.73 109.1c-2.24-9.03-13.54-12.09-20.12-5.51l-74.36 74.36-67.88-11.31-11.31-67.88 74.36-74.36c6.62-6.62 3.43-17.9-5.66-20.16-47.38-11.74-99.55.91-136.58 37.93-39.64 39.64-50.55 97.1-34.05 147.2L18.74 402.76c-24.99 24.99-24.99 65.51 0 90.5 24.99 24.99 65.51 24.99 90.5 0l213.21-213.21c50.12 16.71 107.47 5.68 147.37-34.22 37.07-37.07 49.7-89.32 37.91-136.73zM64 472c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24z"},"child":[]}]})(props);
}function FaTrash (props) {
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
}function FaServer (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M480 160H32c-17.673 0-32-14.327-32-32V64c0-17.673 14.327-32 32-32h448c17.673 0 32 14.327 32 32v64c0 17.673-14.327 32-32 32zm-48-88c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24zm-64 0c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24zm112 248H32c-17.673 0-32-14.327-32-32v-64c0-17.673 14.327-32 32-32h448c17.673 0 32 14.327 32 32v64c0 17.673-14.327 32-32 32zm-48-88c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24zm-64 0c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24zm112 248H32c-17.673 0-32-14.327-32-32v-64c0-17.673 14.327-32 32-32h448c17.673 0 32 14.327 32 32v64c0 17.673-14.327 32-32 32zm-48-88c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24zm-64 0c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24z"},"child":[]}]})(props);
}function FaSearch (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"},"child":[]}]})(props);
}function FaPlay (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 448 512"},"child":[{"tag":"path","attr":{"d":"M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"},"child":[]}]})(props);
}function FaMicrochip (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M416 48v416c0 26.51-21.49 48-48 48H144c-26.51 0-48-21.49-48-48V48c0-26.51 21.49-48 48-48h224c26.51 0 48 21.49 48 48zm96 58v12a6 6 0 0 1-6 6h-18v6a6 6 0 0 1-6 6h-42V88h42a6 6 0 0 1 6 6v6h18a6 6 0 0 1 6 6zm0 96v12a6 6 0 0 1-6 6h-18v6a6 6 0 0 1-6 6h-42v-48h42a6 6 0 0 1 6 6v6h18a6 6 0 0 1 6 6zm0 96v12a6 6 0 0 1-6 6h-18v6a6 6 0 0 1-6 6h-42v-48h42a6 6 0 0 1 6 6v6h18a6 6 0 0 1 6 6zm0 96v12a6 6 0 0 1-6 6h-18v6a6 6 0 0 1-6 6h-42v-48h42a6 6 0 0 1 6 6v6h18a6 6 0 0 1 6 6zM30 376h42v48H30a6 6 0 0 1-6-6v-6H6a6 6 0 0 1-6-6v-12a6 6 0 0 1 6-6h18v-6a6 6 0 0 1 6-6zm0-96h42v48H30a6 6 0 0 1-6-6v-6H6a6 6 0 0 1-6-6v-12a6 6 0 0 1 6-6h18v-6a6 6 0 0 1 6-6zm0-96h42v48H30a6 6 0 0 1-6-6v-6H6a6 6 0 0 1-6-6v-12a6 6 0 0 1 6-6h18v-6a6 6 0 0 1 6-6zm0-96h42v48H30a6 6 0 0 1-6-6v-6H6a6 6 0 0 1-6-6v-12a6 6 0 0 1 6-6h18v-6a6 6 0 0 1 6-6z"},"child":[]}]})(props);
}function FaListAlt (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M464 480H48c-26.51 0-48-21.49-48-48V80c0-26.51 21.49-48 48-48h416c26.51 0 48 21.49 48 48v352c0 26.51-21.49 48-48 48zM128 120c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40-17.909-40-40-40zm0 96c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40-17.909-40-40-40zm0 96c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40-17.909-40-40-40zm288-136v-32c0-6.627-5.373-12-12-12H204c-6.627 0-12 5.373-12 12v32c0 6.627 5.373 12 12 12h200c6.627 0 12-5.373 12-12zm0 96v-32c0-6.627-5.373-12-12-12H204c-6.627 0-12 5.373-12 12v32c0 6.627 5.373 12 12 12h200c6.627 0 12-5.373 12-12zm0 96v-32c0-6.627-5.373-12-12-12H204c-6.627 0-12 5.373-12 12v32c0 6.627 5.373 12 12 12h200c6.627 0 12-5.373 12-12z"},"child":[]}]})(props);
}function FaHeartbeat (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M320.2 243.8l-49.7 99.4c-6 12.1-23.4 11.7-28.9-.6l-56.9-126.3-30 71.7H60.6l182.5 186.5c7.1 7.3 18.6 7.3 25.7 0L451.4 288H342.3l-22.1-44.2zM473.7 73.9l-2.4-2.5c-51.5-52.6-135.8-52.6-187.4 0L256 100l-27.9-28.5c-51.5-52.7-135.9-52.7-187.4 0l-2.4 2.4C-10.4 123.7-12.5 203 31 256h102.4l35.9-86.2c5.4-12.9 23.6-13.2 29.4-.4l58.2 129.3 49-97.9c5.9-11.8 22.7-11.8 28.6 0l27.6 55.2H481c43.5-53 41.4-132.3-7.3-182.1z"},"child":[]}]})(props);
}function FaGamepad (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 640 512"},"child":[{"tag":"path","attr":{"d":"M480.07 96H160a160 160 0 1 0 114.24 272h91.52A160 160 0 1 0 480.07 96zM248 268a12 12 0 0 1-12 12h-52v52a12 12 0 0 1-12 12h-24a12 12 0 0 1-12-12v-52H84a12 12 0 0 1-12-12v-24a12 12 0 0 1 12-12h52v-52a12 12 0 0 1 12-12h24a12 12 0 0 1 12 12v52h52a12 12 0 0 1 12 12zm216 76a40 40 0 1 1 40-40 40 40 0 0 1-40 40zm64-96a40 40 0 1 1 40-40 40 40 0 0 1-40 40z"},"child":[]}]})(props);
}function FaFolderOpen (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 576 512"},"child":[{"tag":"path","attr":{"d":"M572.694 292.093L500.27 416.248A63.997 63.997 0 0 1 444.989 448H45.025c-18.523 0-30.064-20.093-20.731-36.093l72.424-124.155A64 64 0 0 1 152 256h399.964c18.523 0 30.064 20.093 20.73 36.093zM152 224h328v-48c0-26.51-21.49-48-48-48H272l-64-64H48C21.49 64 0 85.49 0 112v278.046l69.077-118.418C86.214 242.25 117.989 224 152 224z"},"child":[]}]})(props);
}function FaFileImport (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M16 288c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h112v-64zm489-183L407.1 7c-4.5-4.5-10.6-7-17-7H384v128h128v-6.1c0-6.3-2.5-12.4-7-16.9zm-153 31V0H152c-13.3 0-24 10.7-24 24v264h128v-65.2c0-14.3 17.3-21.4 27.4-11.3L379 308c6.6 6.7 6.6 17.4 0 24l-95.7 96.4c-10.1 10.1-27.4 3-27.4-11.3V352H128v136c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H376c-13.2 0-24-10.8-24-24z"},"child":[]}]})(props);
}function FaFileArchive (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 384 512"},"child":[{"tag":"path","attr":{"d":"M377 105L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1c0-6.3-2.5-12.4-7-16.9zM128.4 336c-17.9 0-32.4 12.1-32.4 27 0 15 14.6 27 32.5 27s32.4-12.1 32.4-27-14.6-27-32.5-27zM224 136V0h-63.6v32h-32V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zM95.9 32h32v32h-32zm32.3 384c-33.2 0-58-30.4-51.4-62.9L96.4 256v-32h32v-32h-32v-32h32v-32h-32V96h32V64h32v32h-32v32h32v32h-32v32h32v32h-32v32h22.1c5.7 0 10.7 4.1 11.8 9.7l17.3 87.7c6.4 32.4-18.4 62.6-51.4 62.6z"},"child":[]}]})(props);
}function FaExclamationTriangle (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 576 512"},"child":[{"tag":"path","attr":{"d":"M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"},"child":[]}]})(props);
}function FaClipboardCheck (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 384 512"},"child":[{"tag":"path","attr":{"d":"M336 64h-80c0-35.3-28.7-64-64-64s-64 28.7-64 64H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48zM192 40c13.3 0 24 10.7 24 24s-10.7 24-24 24-24-10.7-24-24 10.7-24 24-24zm121.2 231.8l-143 141.8c-4.7 4.7-12.3 4.6-17-.1l-82.6-83.3c-4.7-4.7-4.6-12.3.1-17L99.1 285c4.7-4.7 12.3-4.6 17 .1l46 46.4 106-105.2c4.7-4.7 12.3-4.6 17 .1l28.2 28.4c4.7 4.8 4.6 12.3-.1 17z"},"child":[]}]})(props);
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
const toaster = api.toaster;

const MAX_ENTRIES = 300;
let entries = [];
let nextId = 1;
const listeners = new Set();
const format = (value) => {
    if (typeof value === "string")
        return value;
    try {
        const text = JSON.stringify(value);
        return text.length > 500 ? `${text.slice(0, 500)}... (${text.length} chars)` : text;
    }
    catch {
        return String(value);
    }
};
// Writes to the CEF devtools console and to the in-plugin Logs tab
function log(level, message, ...details) {
    const consoleFn = level === "info" ? console.log : level === "warn" ? console.warn : console.error;
    consoleFn("[HV Control]", message, ...details);
    const text = details.length ? `${message} ${details.map(format).join(" ")}` : message;
    entries = [...entries.slice(-(MAX_ENTRIES - 1)), { id: nextId++, time: Date.now(), level, message: text }];
    listeners.forEach((listener) => listener());
}
const logAction = (label, details) => details === undefined ? log("info", `[action] ${label}`) : log("info", `[action] ${label}`, details);
function clearLogs() {
    entries = [];
    listeners.forEach((listener) => listener());
}
function useLogs() {
    const [, rerender] = SP_REACT.useState(0);
    SP_REACT.useEffect(() => {
        const listener = () => rerender((n) => n + 1);
        listeners.add(listener);
        return () => {
            listeners.delete(listener);
        };
    }, []);
    return entries;
}

// Polled constantly; only logged when they fail
const QUIET_ROUTES = new Set(["get_system_status", "get_backend_log"]);
// User-triggered actions whose result message is also shown as a Steam toast
const TOAST_ROUTES = new Set([
    "open_in_dolphin", "extract_cpuid_zip", "build_and_install_module", "start_module", "stop_module",
    "disable_umip", "uninstall_module", "configure_hv_games", "disable_hv_games", "import_module_source",
    "apply_hv_patch", "check_patch", "remove_patch"
]);
const toast = (body) => {
    try {
        toaster.toast({ title: "CPUID & HV Controls", body });
    }
    catch (e) {
        console.error("[HV Control] toast failed", e);
    }
};
// Wraps a backend call with logging of arguments, result, errors, duration and slow calls
function loggedCallable(route) {
    const call = callable(route);
    return async (...args) => {
        const quiet = QUIET_ROUTES.has(route);
        const start = Date.now();
        if (!quiet)
            log("info", `-> ${route}`, args);
        const slowTimer = setTimeout(() => log("warn", `${route} still waiting for the backend after 15s`), 15000);
        try {
            const result = await call(...args);
            const ms = Date.now() - start;
            const res = result;
            // Module start/stop return a tagged step-by-step trace: [HVMOD <id>] [start:<step>] ...
            if (res && Array.isArray(res.trace)) {
                for (const entry of res.trace) {
                    const level = entry.level === "error" ? "error" : entry.level === "warning" ? "warn" : "info";
                    log(level, entry.line);
                }
            }
            if (res && typeof res === "object" && res.success === false) {
                log("warn", `<- ${route} failed (${ms}ms): ${res.message}`);
            }
            else if (!quiet) {
                log("info", `<- ${route} ok (${ms}ms)`, res && Array.isArray(res.trace) ? { ...res, trace: `${res.trace.length} lines` } : result);
            }
            if (TOAST_ROUTES.has(route) && res && typeof res.message === "string")
                toast(res.message);
            return result;
        }
        catch (e) {
            log("error", `x ${route} threw (${Date.now() - start}ms): ${e?.message || e}`);
            if (TOAST_ROUTES.has(route))
                toast(`${route} failed: ${e?.message || e}`);
            throw e;
        }
        finally {
            clearTimeout(slowTimer);
        }
    };
}
const getSystemStatus = loggedCallable("get_system_status");
const scanForZips = loggedCallable("scan_for_zips");
const openInDolphin = loggedCallable("open_in_dolphin");
const extractCpuidZip = loggedCallable("extract_cpuid_zip");
const buildAndInstallModule = loggedCallable("build_and_install_module");
const startModule = loggedCallable("start_module");
const stopModule = loggedCallable("stop_module");
const disableUmip = loggedCallable("disable_umip");
const uninstallModule = loggedCallable("uninstall_module");
loggedCallable("get_steam_shortcuts");
const getHvGameCandidates = loggedCallable("get_hv_game_candidates");
const getHvGamesStatus = loggedCallable("get_hv_games_status");
const configureHvGames = loggedCallable("configure_hv_games");
const disableHvGames = loggedCallable("disable_hv_games");
const getPatchableGames = loggedCallable("get_patchable_games");
const findGameShippingExe = loggedCallable("find_game_shipping_exe");
const scanForPatches = loggedCallable("scan_for_patches");
const applyHvPatch = loggedCallable("apply_hv_patch");
const listInstalledPatches = loggedCallable("list_installed_patches");
const checkPatch = loggedCallable("check_patch");
const removePatch = loggedCallable("remove_patch");
const findModuleSources = loggedCallable("find_module_sources");
const importModuleSource = loggedCallable("import_module_source");
const getBackendLog = loggedCallable("get_backend_log");

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

// Decky remounts panel content (closing the menu, opening a dropdown popup, switching tabs),
// which wipes plain useState. Keep selections at module level so they survive remounts.
const store = new Map();
function usePersistentState(key, initial) {
    const [value, setValue] = SP_REACT.useState(() => (store.has(key) ? store.get(key) : initial));
    const update = SP_REACT.useCallback((next) => {
        setValue((prev) => {
            const resolved = typeof next === "function" ? next(prev) : next;
            store.set(key, resolved);
            return resolved;
        });
    }, [key]);
    return [value, update];
}

// Steam's TextField can fire onChange with the text it is still showing (e.g. when focus moves
// to or back from a dropdown popup), which overwrote the path just picked from the dropdown.
// Only report text that differs from what the field shows, and remount the field when the value
// changes from outside so it displays the newly picked path.
const PathField = ({ label, value, onChange }) => {
    const shown = SP_REACT.useRef(value);
    const version = SP_REACT.useRef(0);
    if (value !== shown.current) {
        shown.current = value;
        version.current += 1;
    }
    return (SP_JSX.jsx(DFL.TextField, { label: label, value: value, onChange: (e) => {
            const next = e.target.value;
            if (next === shown.current)
                return;
            // Typed change: record it first so the parent's re-render doesn't remount mid-typing
            shown.current = next;
            onChange(next);
        } }, version.current));
};

const ZipSelector = ({ sourceExists, onRefresh, onLogMsg }) => {
    const [zipList, setZipList] = usePersistentState("zip.list", []);
    const [selectedPath, setSelectedPath] = usePersistentState("zip.selected", "");
    const [loading, setLoading] = SP_REACT.useState(false);
    const scanZips = async () => {
        logAction("Scan for zip files");
        try {
            const res = await scanForZips();
            if (res && Array.isArray(res)) {
                setZipList(res);
                // Only default to the first zip when nothing has been chosen or typed yet
                setSelectedPath((prev) => prev || (res.length > 0 ? res[0].path : ""));
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
        logAction("Open Location in Dolphin", { path: selectedPath });
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
        logAction("Extract & Prepare Zip", { path: selectedPath });
        if (!selectedPath) {
            onLogMsg("Please select or enter a path to cpuid_fault_emulation.zip");
            return;
        }
        setLoading(true);
        onLogMsg(`Extracting ${selectedPath}...`);
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
                    })), selectedOption: selectedPath, onChange: (opt) => {
                        logAction("Select zip file", opt.data);
                        setSelectedPath(opt.data);
                    } }) })), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(PathField, { label: "Zip Archive Path", value: selectedPath, onChange: setSelectedPath }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx("div", { style: { display: "flex", gap: "8px", width: "100%" }, children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", disabled: loading, onClick: handleOpenDolphin, children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", gap: "6px" }, children: [SP_JSX.jsx(FaFolderOpen, {}), " Open Location in Dolphin"] }) }) }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", disabled: loading || !selectedPath, onClick: handleExtractZip, children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", gap: "6px" }, children: [SP_JSX.jsx(FaFileArchive, {}), " Extract & Prepare Zip"] }) }) })] }));
};

const describe = (s) => s.matches_kernel ? "built, ready" : s.has_ko ? "built, old kernel" : "source only";
const ModuleImport = ({ onRefresh, onLogMsg }) => {
    const [sources, setSources] = usePersistentState("module.sources", []);
    const [selected, setSelected] = usePersistentState("module.selected", "");
    const [scanning, setScanning] = SP_REACT.useState(false);
    const [importing, setImporting] = SP_REACT.useState(false);
    const scan = async () => {
        logAction("Search for module folders");
        setScanning(true);
        try {
            const res = await findModuleSources();
            if (Array.isArray(res)) {
                setSources(res);
                setSelected((prev) => res.some((s) => s.path === prev) ? prev : res.length > 0 ? res[0].path : "");
            }
        }
        catch (e) {
            console.error("Failed to find module folders:", e);
        }
        finally {
            setScanning(false);
        }
    };
    SP_REACT.useEffect(() => {
        scan();
    }, []);
    const handleImport = async () => {
        logAction("Import Into Plugin", { path: selected });
        setImporting(true);
        onLogMsg(`Importing module from ${selected}...`);
        try {
            const res = await importModuleSource(selected);
            onLogMsg(res.message);
            if (res.success)
                onRefresh();
        }
        catch (e) {
            onLogMsg(`Import error: ${e.message || e}`);
        }
        finally {
            setImporting(false);
        }
    };
    return (SP_JSX.jsxs(DFL.PanelSection, { title: "Import Existing Module (hv-install.sh)", children: [sources.length === 0 ? (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx("div", { style: { fontSize: "12px", color: "#9ca3af" }, children: scanning
                        ? "Searching your home folder..."
                        : "No cpuid_fault_emulation folder found in your home folder. Extract the zip below instead." }) })) : (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.DropdownItem, { label: "Found Module Folders", rgOptions: sources.map((s) => ({ data: s.path, label: `${s.path} (${describe(s)})` })), selectedOption: selected, onChange: (opt) => {
                                logAction("Select module folder", opt.data);
                                setSelected(opt.data);
                            } }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", disabled: importing || !selected, onClick: handleImport, children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", gap: "6px" }, children: [SP_JSX.jsx(FaFileImport, {}), " ", importing ? "Importing..." : "Import Into Plugin"] }) }) })] })), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", disabled: scanning, onClick: scan, children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", gap: "6px" }, children: [SP_JSX.jsx(FaSearch, {}), " Search Again"] }) }) })] }));
};

const ModuleActions = ({ status, onRefresh, onLogMsg }) => {
    const [working, setWorking] = SP_REACT.useState(false);
    const isLoaded = status?.is_loaded;
    const isInstalled = status?.is_installed;
    const vermagicMatch = status?.vermagic_match;
    const sourceExists = status?.source_exists;
    const osType = status?.os_type;
    const handleStart = async () => {
        logAction("Start Module");
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
        logAction("Stop Module");
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
        logAction("Build & Install Module", { os: osType, kernel: status?.kernel_release });
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
        logAction("Uninstall Module (confirmation shown)");
        DFL.showModal(SP_JSX.jsx(DFL.ConfirmModal, { strTitle: "Uninstall CPUID Module?", strDescription: "Are you sure you want to stop and remove the cpuid_fault_emulation kernel module?", onOK: async () => {
                logAction("Uninstall Module confirmed");
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
        logAction("Load games and watcher status");
        try {
            const [shortcutsRes, statusRes] = await Promise.all([
                getHvGameCandidates(),
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
        logAction("Toggle HV game", appid);
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
        logAction("Save & Enable HV Watcher", Array.from(selectedAppIds));
        if (selectedAppIds.size === 0) {
            onLogMsg("Please select at least one game.");
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
        logAction("Disable Watcher");
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
    return (SP_JSX.jsxs(DFL.PanelSection, { title: "HV Games Automator", children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.Field, { label: "Watcher Status", children: watcherStatus.active ? (SP_JSX.jsxs("span", { style: { color: "#4ade80", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }, children: [SP_JSX.jsx(FaCheckCircle, {}), " Active (", watcherStatus.appids.length, " game(s))"] })) : watcherStatus.configured ? (SP_JSX.jsxs("span", { style: { color: "#facc15", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }, children: [SP_JSX.jsx(FaTimesCircle, {}), " Service Inactive"] })) : (SP_JSX.jsx("span", { style: { color: "#9ca3af" }, children: "Disabled" })) }) }), shortcuts.length === 0 ? (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx("div", { style: { padding: "8px", fontSize: "12px", color: "#9ca3af" }, children: "No installed Steam games or non-Steam shortcuts found." }) })) : (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx("div", { style: { fontSize: "12px", color: "#d1d5db", marginBottom: "4px" }, children: "Select Steam or non-Steam games to automatically start/stop the CPUID module on launch/exit:" }) }), shortcuts.map((sc) => (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ToggleField, { label: sc.name, description: `${sc.source === "steam" ? "Steam" : "Non-Steam"} · AppID ${sc.appid}`, checked: selectedAppIds.has(sc.appid), onChange: () => toggleAppId(sc.appid) }) }, sc.appid))), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", disabled: loading || selectedAppIds.size === 0, onClick: handleApplyConfig, children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", gap: "6px" }, children: [SP_JSX.jsx(FaGamepad, {}), " Save & Enable HV Watcher (", selectedAppIds.size, ")"] }) }) })] })), watcherStatus.configured && (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", disabled: loading, onClick: handleDisableWatcher, children: SP_JSX.jsx("span", { style: { color: "#f87171" }, children: "Disable Watcher" }) }) }))] }));
};

const UmipCard = ({ umipDisabled, onRefresh, onLogMsg }) => {
    const [loading, setLoading] = SP_REACT.useState(false);
    const handleDisableUmip = async () => {
        logAction("Disable UMIP");
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
const PatchCard = ({ onLogMsg, onApplied }) => {
    const [games, setGames] = usePersistentState("patch.games", []);
    const [selectedGameId, setSelectedGameId] = usePersistentState("patch.game", "");
    const [exeCandidates, setExeCandidates] = usePersistentState("patch.exeCandidates", []);
    const [selectedExe, setSelectedExe] = usePersistentState("patch.exe", "");
    const [searching, setSearching] = SP_REACT.useState(false);
    const [patches, setPatches] = usePersistentState("patch.archives", []);
    const [patchPath, setPatchPath] = usePersistentState("patch.archive", "");
    const [applying, setApplying] = SP_REACT.useState(false);
    const loadLists = async () => {
        logAction("Scan games and patch archives");
        try {
            const [gamesRes, patchesRes] = await Promise.all([getPatchableGames(), scanForPatches()]);
            if (Array.isArray(gamesRes))
                setGames(gamesRes);
            if (Array.isArray(patchesRes)) {
                setPatches(patchesRes);
                setPatchPath((prev) => prev || (patchesRes.length > 0 ? patchesRes[0].path : ""));
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
        logAction("Select game", gameId);
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
        logAction("Apply Patch confirmed", { exe: selectedExe, patch: patchPath });
        setApplying(true);
        onLogMsg(`Applying ${fileName(patchPath)}...`);
        try {
            const game = games.find((g) => g.id === selectedGameId);
            const res = await applyHvPatch(selectedExe, patchPath, game?.name || "");
            onLogMsg(res.message);
            if (res.success)
                onApplied();
        }
        catch (e) {
            onLogMsg(`Patch error: ${e.message || e}`);
        }
        finally {
            setApplying(false);
        }
    };
    const handleApply = () => {
        logAction("Apply Patch to Game (confirmation shown)", { exe: selectedExe, patch: patchPath });
        const game = games.find((g) => g.id === selectedGameId);
        DFL.showModal(SP_JSX.jsx(DFL.ConfirmModal, { strTitle: "Apply HV Patch?", strDescription: `Extract ${fileName(patchPath)} into the folder of ${fileName(selectedExe)} for ${game?.name || "this game"}? Every file is tracked and overwritten originals are backed up, so you can remove the patch later.`, onOK: runApply }));
    };
    const selectedExeDir = selectedExe ? selectedExe.substring(0, selectedExe.lastIndexOf("/")) : "";
    return (SP_JSX.jsxs(DFL.PanelSection, { title: "Custom HV Patch", children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.DropdownItem, { label: "Game", strDefaultLabel: games.length ? "Select a game" : "No installed games found", rgOptions: games.map((g) => ({
                        data: g.id,
                        label: `${g.name}${g.source === "non-steam" ? " (Non-Steam)" : ""}`
                    })), selectedOption: selectedGameId, onChange: (opt) => selectGame(opt.data) }) }), selectedGameId && (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.Field, { label: "Shipping EXE", children: searching ? (SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", gap: "6px", color: "#9ca3af" }, children: [SP_JSX.jsx(FaSearch, {}), " Searching..."] })) : selectedExe ? (SP_JSX.jsx("span", { style: { color: "#4ade80", fontWeight: 600, wordBreak: "break-all" }, children: fileName(selectedExe) })) : (SP_JSX.jsx("span", { style: { color: "#f87171", fontWeight: 600 }, children: "Not Found" })) }) })), exeCandidates.length > 1 && (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.DropdownItem, { label: "Multiple EXEs found", rgOptions: exeCandidates.map((c) => ({ data: c, label: c })), selectedOption: selectedExe, onChange: (opt) => {
                        logAction("Select shipping exe", opt.data);
                        setSelectedExe(opt.data);
                    } }) })), selectedExeDir && (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsxs("div", { style: { fontSize: "11px", color: "#9ca3af", wordBreak: "break-all" }, children: ["Target: ", selectedExeDir] }) })), patches.length > 0 && (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.DropdownItem, { label: "Patch Archive", rgOptions: patches.map((p) => ({
                        data: p.path,
                        label: `${p.name} (${(p.size / 1024 / 1024).toFixed(1)} MB)`
                    })), selectedOption: patchPath, onChange: (opt) => {
                        logAction("Select patch archive", opt.data);
                        setPatchPath(opt.data);
                    } }) })), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(PathField, { label: "Patch Path (.zip / .7z / .rar)", value: patchPath, onChange: setPatchPath }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", disabled: applying, onClick: loadLists, children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", gap: "6px" }, children: [SP_JSX.jsx(FaSync, {}), " Rescan Games & Patches"] }) }) }), selectedExeDir && (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", onClick: () => {
                        logAction("Open Game Folder in Dolphin", selectedExeDir);
                        openInDolphin(selectedExeDir).catch(() => { });
                    }, children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", gap: "6px" }, children: [SP_JSX.jsx(FaFolderOpen, {}), " Open Game Folder in Dolphin"] }) }) })), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", disabled: applying || searching || !selectedExe || !patchPath, onClick: handleApply, children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", gap: "6px" }, children: [SP_JSX.jsx(FaFileArchive, {}), " ", applying ? "Applying Patch..." : "Apply Patch to Game"] }) }) })] }));
};

const InstalledPatches = ({ onLogMsg, refreshKey }) => {
    const [patches, setPatches] = SP_REACT.useState([]);
    const [selectedId, setSelectedId] = usePersistentState("patches.selected", "");
    const [check, setCheck] = SP_REACT.useState(null);
    const [needsForce, setNeedsForce] = SP_REACT.useState(false);
    const [working, setWorking] = SP_REACT.useState(false);
    const load = async () => {
        logAction("Load installed patches");
        try {
            const res = await listInstalledPatches();
            if (Array.isArray(res)) {
                setPatches(res);
                if (!res.some((p) => p.id === selectedId)) {
                    setSelectedId(res.length > 0 ? res[0].id : "");
                    setCheck(null);
                    setNeedsForce(false);
                }
            }
        }
        catch (e) {
            console.error("Failed to list installed patches:", e);
        }
    };
    SP_REACT.useEffect(() => {
        load();
    }, [refreshKey]);
    const selected = patches.find((p) => p.id === selectedId);
    const selectPatch = (id) => {
        logAction("Select installed patch", id);
        setSelectedId(id);
        setCheck(null);
        setNeedsForce(false);
    };
    const handleCheck = async () => {
        logAction("Check Patched Files", { id: selectedId });
        setWorking(true);
        try {
            const res = await checkPatch(selectedId);
            onLogMsg(res.message);
            if (res.success)
                setCheck({ intact: res.intact, missing: res.missing, modified: res.modified });
        }
        catch (e) {
            onLogMsg(`Check error: ${e.message || e}`);
        }
        finally {
            setWorking(false);
        }
    };
    const runRemove = async (force) => {
        logAction(force ? "Force Remove confirmed" : "Remove Patch confirmed", { id: selectedId });
        setWorking(true);
        onLogMsg(`${force ? "Force removing" : "Removing"} ${selected?.archive_name}...`);
        try {
            const res = await removePatch(selectedId, force);
            onLogMsg(res.message);
            setNeedsForce(!!res.needs_force);
            setCheck(null);
            await load();
        }
        catch (e) {
            onLogMsg(`Remove error: ${e.message || e}`);
        }
        finally {
            setWorking(false);
        }
    };
    const confirmRemove = (force) => {
        logAction(`${force ? "Force Remove" : "Remove Patch"} (confirmation shown)`, { id: selectedId });
        if (!selected)
            return;
        DFL.showModal(SP_JSX.jsx(DFL.ConfirmModal, { strTitle: force ? "Force Remove Patch?" : "Remove Patch?", strDescription: force
                ? `This reverts the remaining files of ${selected.archive_name} even though they changed since patching (for example after a game update). Only do this if the game is broken.`
                : `Delete the ${selected.added} file(s) ${selected.archive_name} added to ${selected.game_name} and restore the ${selected.replaced} original file(s) it replaced?`, onOK: () => runRemove(force) }));
    };
    return (SP_JSX.jsx(DFL.PanelSection, { title: "Installed Patches", children: patches.length === 0 ? (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx("div", { style: { fontSize: "12px", color: "#9ca3af" }, children: "No tracked patches. Patches you apply above appear here." }) })) : (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.DropdownItem, { label: "Patch", rgOptions: patches.map((p) => ({ data: p.id, label: `${p.game_name}: ${p.archive_name}` })), selectedOption: selectedId, onChange: (opt) => selectPatch(opt.data) }) }), selected && (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.Field, { label: "Applied", children: SP_JSX.jsx("span", { children: new Date(selected.applied_at * 1000).toLocaleString() }) }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.Field, { label: "Files", children: SP_JSX.jsxs("span", { children: [selected.added, " added, ", selected.replaced, " replaced"] }) }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsxs("div", { style: { fontSize: "11px", color: "#9ca3af", wordBreak: "break-all" }, children: [selected.target_dir, SP_JSX.jsx("br", {}), selected.files.slice(0, 8).join(", "), selected.files.length > 8 ? ` and ${selected.files.length - 8} more` : ""] }) })] })), check && (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx("div", { style: { fontSize: "12px", wordBreak: "break-all" }, children: check.missing.length === 0 && check.modified.length === 0 ? (SP_JSX.jsxs("span", { style: { color: "#4ade80" }, children: ["All ", check.intact.length, " patched file(s) intact."] })) : (SP_JSX.jsxs("span", { style: { color: "#facc15" }, children: [SP_JSX.jsx(FaExclamationTriangle, {}), " Changed: ", check.modified.join(", ") || "none", ". Missing: ", check.missing.join(", ") || "none", "."] })) }) })), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", disabled: working || !selected, onClick: handleCheck, children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", gap: "6px" }, children: [SP_JSX.jsx(FaClipboardCheck, {}), " Check Patched Files"] }) }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", disabled: working || !selected, onClick: () => confirmRemove(false), children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", gap: "6px", color: "#f87171" }, children: [SP_JSX.jsx(FaTrash, {}), " Remove Patch"] }) }) }), needsForce && (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", disabled: working || !selected, onClick: () => confirmRemove(true), children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", gap: "6px", color: "#f87171" }, children: [SP_JSX.jsx(FaExclamationTriangle, {}), " Force Remove"] }) }) }))] })) }));
};

const TabBar = ({ tabs, activeTab, onSelect }) => (SP_JSX.jsx(DFL.Focusable, { "flow-children": "horizontal", style: { display: "flex", gap: "4px", padding: "4px 12px 8px" }, children: tabs.map((tab) => {
        const active = tab.id === activeTab;
        return (SP_JSX.jsxs(DFL.DialogButton, { onClick: () => onSelect(tab.id), style: {
                flex: 1,
                minWidth: 0,
                height: "auto",
                padding: "6px 2px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "3px",
                fontSize: "10px",
                lineHeight: "12px",
                background: active ? "#3b82f6" : undefined,
                color: active ? "#ffffff" : undefined
            }, children: [SP_JSX.jsx("span", { style: { fontSize: "15px", display: "flex" }, children: tab.icon }), SP_JSX.jsx("span", { style: { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%" }, children: tab.label })] }, tab.id));
    }) }));

const LEVEL_COLORS = {
    info: "#d1d5db",
    warn: "#facc15",
    error: "#f87171"
};
const MAX_SHOWN = 60;
const logBoxStyle = {
    fontFamily: "monospace",
    fontSize: "10px",
    lineHeight: "13px",
    maxHeight: "260px",
    overflowY: "auto",
    background: "rgba(0, 0, 0, 0.35)",
    borderRadius: "4px",
    padding: "6px",
    wordBreak: "break-all",
    whiteSpace: "pre-wrap"
};
const LogsView = () => {
    const entries = useLogs();
    const [backendLines, setBackendLines] = SP_REACT.useState(null);
    const [backendPath, setBackendPath] = SP_REACT.useState("");
    const [loading, setLoading] = SP_REACT.useState(false);
    const loadBackendLog = async () => {
        logAction("Load Backend Log");
        setLoading(true);
        try {
            const res = await getBackendLog(150);
            setBackendPath(res.path || "");
            setBackendLines(res.success ? res.lines : [res.message]);
        }
        catch (e) {
            setBackendLines([`Could not reach the backend: ${e?.message || e}`]);
        }
        finally {
            setLoading(false);
        }
    };
    const shown = entries.slice(-MAX_SHOWN).reverse();
    return (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsxs(DFL.PanelSection, { title: `Plugin Log (${entries.length})`, children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx("div", { style: logBoxStyle, children: shown.length === 0
                                ? "No activity yet."
                                : shown.map((entry) => (SP_JSX.jsxs("div", { style: { color: LEVEL_COLORS[entry.level] }, children: [new Date(entry.time).toLocaleTimeString(), " ", entry.message] }, entry.id))) }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", onClick: clearLogs, children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", gap: "6px" }, children: [SP_JSX.jsx(FaTrash, {}), " Clear Plugin Log"] }) }) })] }), SP_JSX.jsxs(DFL.PanelSection, { title: "Backend Log", children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", disabled: loading, onClick: loadBackendLog, children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", gap: "6px" }, children: [SP_JSX.jsx(FaServer, {}), " ", loading ? "Loading..." : backendLines ? "Reload Backend Log" : "Load Backend Log"] }) }) }), backendLines && (SP_JSX.jsxs(DFL.PanelSectionRow, { children: [SP_JSX.jsx("div", { style: { fontSize: "10px", color: "#9ca3af", marginBottom: "4px", wordBreak: "break-all" }, children: backendPath }), SP_JSX.jsx("div", { style: logBoxStyle, children: backendLines.length === 0 ? "Backend log is empty." : [...backendLines].reverse().join("\n") })] }))] })] }));
};

const TABS = [
    { id: "module", label: "Module", icon: SP_JSX.jsx(FaHeartbeat, {}) },
    { id: "source", label: "Source", icon: SP_JSX.jsx(FaFileArchive, {}) },
    { id: "games", label: "Games", icon: SP_JSX.jsx(FaGamepad, {}) },
    { id: "patch", label: "Patch", icon: SP_JSX.jsx(FaWrench, {}) },
    { id: "umip", label: "UMIP", icon: SP_JSX.jsx(FaShieldAlt, {}) },
    { id: "logs", label: "Logs", icon: SP_JSX.jsx(FaListAlt, {}) }
];
// Remembered across panel open/close, since Content remounts each time
let lastTab = TABS[0].id;
const Content = () => {
    const [status, setStatus] = SP_REACT.useState(null);
    const [logMsg, setLogMsg] = SP_REACT.useState("");
    // Every status message shown in the panel also goes to the log
    const showMsg = SP_REACT.useCallback((msg) => {
        log("info", `[status] ${msg}`);
        setLogMsg(msg);
    }, []);
    const [activeTab, setActiveTab] = SP_REACT.useState(lastTab);
    const [patchesVersion, setPatchesVersion] = SP_REACT.useState(0);
    const selectTab = (id) => {
        logAction("Switch tab", id);
        lastTab = id;
        setActiveTab(id);
    };
    const refreshStatus = async () => {
        try {
            const res = await getSystemStatus();
            if (res) {
                setStatus(res);
            }
        }
        catch (e) {
            log("error", `Failed to fetch system status: ${e?.message || e}`);
        }
    };
    SP_REACT.useEffect(() => {
        refreshStatus();
        const interval = setInterval(refreshStatus, 8000);
        return () => clearInterval(interval);
    }, []);
    return (SP_JSX.jsxs("div", { style: { padding: "4px 0" }, children: [SP_JSX.jsx(TabBar, { tabs: TABS, activeTab: activeTab, onSelect: selectTab }), logMsg && (SP_JSX.jsx("div", { style: {
                    margin: "0 12px 8px",
                    padding: "8px 12px",
                    background: "rgba(30, 41, 59, 0.9)",
                    borderLeft: "4px solid #3b82f6",
                    borderRadius: "4px",
                    fontSize: "12px",
                    color: "#e2e8f0",
                    wordBreak: "break-word"
                }, children: logMsg })), activeTab === "module" && (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx(StatusCard, { status: status, onRefresh: refreshStatus }), status?.status_str === "NOT_INSTALLED" && (SP_JSX.jsx("div", { style: { margin: "0 12px 8px", fontSize: "12px", color: "#facc15" }, children: status?.source_exists
                            ? "Source is ready. Use Build & Install Module below."
                            : "No module in the plugin yet. Open the Source tab to import one built with hv-install.sh, or extract the cpuid_fault_emulation zip." })), SP_JSX.jsx(ModuleActions, { status: status, onRefresh: refreshStatus, onLogMsg: showMsg })] })), activeTab === "source" && (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx(ModuleImport, { onRefresh: refreshStatus, onLogMsg: showMsg }), SP_JSX.jsx(ZipSelector, { sourceExists: status?.source_exists || false, onRefresh: refreshStatus, onLogMsg: showMsg })] })), activeTab === "games" && SP_JSX.jsx(HvGamesCard, { onLogMsg: showMsg }), activeTab === "patch" && (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx(PatchCard, { onLogMsg: showMsg, onApplied: () => setPatchesVersion((v) => v + 1) }), SP_JSX.jsx(InstalledPatches, { onLogMsg: showMsg, refreshKey: patchesVersion })] })), activeTab === "logs" && SP_JSX.jsx(LogsView, {}), activeTab === "umip" && (SP_JSX.jsx(UmipCard, { umipDisabled: status?.umip_disabled || false, onRefresh: refreshStatus, onLogMsg: showMsg }))] }));
};
var index = DFL.definePlugin(() => {
    log("info", "Plugin loaded");
    return {
        title: SP_JSX.jsx("div", { className: DFL.staticClasses.Title, children: "CPUID & HV Controls" }),
        icon: SP_JSX.jsx(FaMicrochip, {}),
        content: SP_JSX.jsx(Content, {}),
        onDismount() { }
    };
});

export { index as default };
//# sourceMappingURL=index.js.map
