# xmlToJsonTs

Parsing a XML string into JSON using Typescript.

## Sample

```Typescript
import { XmlParser, IParserConfiguration } from 'xmlToJsonTs';

let config = <IParserConfiguration> { };
config.removeLineBreaks = true;
config.removeComments = true;
config.transformTextOnly = true;

let parser = new XmlParser();
let json = parser.toJson('<YourXmlString></YourXmlString>', config);
console.log(json);
```