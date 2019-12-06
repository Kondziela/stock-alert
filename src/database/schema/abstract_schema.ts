export abstract class AbstractSchema {

    protected static schema;

    public static getSchema() {
        return Object.assign({}, this.schema);
    }

    public static queryBuilder(){}

}

