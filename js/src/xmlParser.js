"use strict";
var XmlParser = (function () {
    function XmlParser() {
    }
    XmlParser.prototype.toJson = function (xmlString, config) {
        var domElement = this.xmlStringToXmlDom(xmlString);
        var json = this.xmlToJson(domElement);
        if (!config)
            return json;
        if (config.removeLineBreaks)
            this.removeLineBreaks(json);
        if (config.removeComments)
            this.removeCommentProperties(json);
        if (config.transformTextOnly)
            this.transformTextOnly(json);
        return json;
    };
    XmlParser.prototype.xmlStringToXmlDom = function (xmlString) {
        var parser = new DOMParser();
        var xmlDoc;
        xmlDoc = parser.parseFromString(xmlString, "text/xml");
        return xmlDoc;
    };
    XmlParser.prototype.removeLineBreaks = function (json) {
        var _this = this;
        Object.keys(json).forEach(function (key, index) {
            if (key === '#text' && Array.isArray(json[key]))
                delete json[key];
            if (typeof json[key] === 'object')
                _this.removeLineBreaks(json[key]);
        });
    };
    XmlParser.prototype.removeCommentProperties = function (json) {
        var _this = this;
        Object.keys(json).forEach(function (key, index) {
            if (key === '#comment')
                delete json[key];
            if (typeof json[key] === 'object')
                _this.removeCommentProperties(json[key]);
        });
    };
    XmlParser.prototype.transformTextOnly = function (json) {
        var _this = this;
        Object.keys(json).forEach(function (key, index) {
            var hasMoreProps = Object.keys(json[key]).length > 1;
            var firstPropertyOfProperty = Object.keys(json[key])[0];
            if (hasMoreProps || typeof (json[key][firstPropertyOfProperty]) === 'object') {
                _this.transformTextOnly(json[key]);
                return;
            }
            if (typeof json[key] === 'object' && json[key]['#text'])
                json[key] = json[key]['#text'];
        });
    };
    XmlParser.prototype.xmlToJson = function (xml) {
        var obj = {};
        if (xml.nodeType == 1) {
            if (xml.attributes.length > 0) {
                obj["@attributes"] = {};
                for (var j = 0; j < xml.attributes.length; j++) {
                    var attribute = xml.attributes.item(j);
                    obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                }
            }
        }
        else if (xml.nodeType == 3) {
            obj = xml.nodeValue;
        }
        if (xml.hasChildNodes()) {
            for (var i = 0; i < xml.childNodes.length; i++) {
                var item = xml.childNodes.item(i);
                var nodeName = item.nodeName;
                if (typeof (obj[nodeName]) == "undefined") {
                    obj[nodeName] = this.xmlToJson(item);
                }
                else {
                    if (typeof (obj[nodeName].push) == "undefined") {
                        var old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push(this.xmlToJson(item));
                }
            }
        }
        return obj;
    };
    ;
    return XmlParser;
}());
exports.XmlParser = XmlParser;
