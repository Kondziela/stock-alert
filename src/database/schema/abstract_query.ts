export class AbstractQuery {

    protected schema;
    protected className;

    protected assignValue(value, field) {
        let fieldObj = this.schema[field];
        if (fieldObj && fieldObj['type'] === typeof value) {
            this.schema[field]['value'] = value;
        } else {
            console.error('Field doesn\'t exist or type is not correct');
        }
    }

    public build(): Object {
        let keys = Object.keys(this.schema)
                .filter(key => this.schema[key]['value'])
                .map(key => JSON.parse(`{
                "${key}": {
                    "${this.mapType(this.schema[key]['type'])}": "${this.schema[key]['value']}"
                }
            }`)),
            query = JSON.parse(`{
            "RequestItems": {
                "${this.className}": {
                    "Keys": [
                        ${JSON.stringify(keys)}
                    ]
                }
            }
        }`);
        return query;
    }

    protected mapType(type) {
        switch (type) {
            case 'number': return 'N';
            case 'boolean': return 'B';
            case 'string': return 'S';
            default: throw new Error('No supported type');
        }
    }
}