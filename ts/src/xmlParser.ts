import { IParserConfiguration } from './interfaces';

export class XmlParser {
    constructor() { }

    // Converts a xml string into json object
    // Accepted parameters:
    // includeLineBreaks: If you want to include the linebreaks as an array property, you need to enable this
    // includeComments: If you want to include the xml comments as an #comment property, you need to enable this
    toJson(
        xmlString: string,
        config?: IParserConfiguration): any {
        // 1. Basic parsing
        let domElement = this.xmlStringToXmlDom(xmlString);
        let json = this.xmlToJson(domElement);
        if (!config)
            return json;

        // 2. Running the config file settings
        if (config.removeLineBreaks)
            this.removeLineBreaks(json);
        if (config.removeComments)
            this.removeCommentProperties(json);
        if (config.transformTextOnly)
            this.transformTextOnly(json);

        return json;
    }

    // Parses an xml string into a xml dom element
    private xmlStringToXmlDom(xmlString: string): Document {
        let parser = new DOMParser();
        let xmlDoc;
        xmlDoc = parser.parseFromString(xmlString, "text/xml");
        return xmlDoc;
    }

    // Tis method cleans up the JSON object which was created from the xmlToJson method.
    // Why? -> If the XML was multilined the JSON object gets on parsing a property which is
    // called '#text' and an array with line breaks. These linebreaks will be removed in this method.
    private removeLineBreaks(json: any): any {
        Object.keys(json).forEach((key, index) => {
            if (key === '#text' && Array.isArray(json[key]))
                delete json[key];
            if (typeof json[key] === 'object')
                this.removeLineBreaks(json[key]);
        });
    }

    // Sometimes xml contains comments. This method removes all comments of the JSON object
    private removeCommentProperties(json: any): any {
        Object.keys(json).forEach((key, index) => {
            if (key === '#comment')
                delete json[key];
            if (typeof json[key] === 'object')
                this.removeCommentProperties(json[key]);
        });
    }

    // if the object has only one property with name '#text'
    // it would be transformed to property == '#text' value
    private transformTextOnly(json: any): any {
        Object.keys(json).forEach((key, index) => {
            let hasMoreProps = Object.keys(json[key]).length > 1;
            let firstPropertyOfProperty = Object.keys(json[key])[0];
            if (hasMoreProps || typeof (json[key][firstPropertyOfProperty]) === 'object') {
                this.transformTextOnly(json[key]);
                return;
            }

            if (typeof json[key] === 'object' && json[key]['#text'])
                json[key] = json[key]['#text'];
        });
    }

    // This method parses an XML DOM element into a JSON object
    private xmlToJson(xml): any {

        // Create the return object
        let obj = {};

        if (xml.nodeType == 1) { // element
            // do attributes
            if (xml.attributes.length > 0) {
                obj["@attributes"] = {};
                for (let j = 0; j < xml.attributes.length; j++) {
                    let attribute = xml.attributes.item(j);
                    obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                }
            }
        } else if (xml.nodeType == 3) { // text
            obj = xml.nodeValue;
        }

        // do children
        if (xml.hasChildNodes()) {
            for (let i = 0; i < xml.childNodes.length; i++) {
                let item = xml.childNodes.item(i);
                let nodeName = item.nodeName;
                if (typeof (obj[nodeName]) == "undefined") {
                    obj[nodeName] = this.xmlToJson(item);
                } else {
                    if (typeof (obj[nodeName].push) == "undefined") {
                        let old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    // if (Object.keys(res).length > 0)
                    obj[nodeName].push(this.xmlToJson(item));
                }
            }
        }
        return obj;
    };
}