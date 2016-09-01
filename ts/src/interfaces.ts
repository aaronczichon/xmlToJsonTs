export interface IParserConfiguration {
    /*
    Removes all properties which has the name '#text' and type array.
    Sample: json.#text = []
    */
    removeLineBreaks: boolean;
    /*
    Removes all properties with name '#comment'.
    Sample: json.#comment
    */
    removeComments: boolean;
    /*
    Transforms a property with #text == string only into
    property == string.
    Sample: json.myProperty.#text = 'sample' -> json.myProperty = 'sample'
    Attention: if json.myProperty has more properties than only #text it 
    is not converted
    */
    transformTextOnly: boolean;
}