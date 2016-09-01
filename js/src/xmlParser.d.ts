import { IParserConfiguration } from './interfaces';
export declare class XmlParser {
    constructor();
    toJson(xmlString: string, config?: IParserConfiguration): any;
    private xmlStringToXmlDom(xmlString);
    private removeLineBreaks(json);
    private removeCommentProperties(json);
    private transformTextOnly(json);
    private xmlToJson(xml);
}
