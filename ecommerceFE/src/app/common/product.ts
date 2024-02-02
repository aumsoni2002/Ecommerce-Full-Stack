// We need to have this 'Product' class because we will be getting data from the backend of same type as this class.
// So we will be saving that data into a list of array which will be of type 'Product' that is this class.  
export class Product {
    constructor(
        public id?: string,
        public sku?: string,
        public name?: string,
        public description?: string,
        public unitPrice?: number,
        public imageUrl?: string,
        public active?: boolean,
        public unitsInStock?: number,
        public dateCreated?: Date,
        public lastUpdated?: Date,
    ) {}
}
