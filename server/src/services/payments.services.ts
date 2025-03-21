class paymentsServices {
    createPaymentUrl () {

        return "";
    }

      sortObject(obj: Object) {
        const sorted: { [key: string]: string } = {};
        const str: string[] = [];
        
        // Collect and sort keys
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                str.push(encodeURIComponent(key));
            }
        }
        str.sort();
        
        // Build sorted object with encoded values
        for (const key of str) {
            const originalKey = decodeURIComponent(key);
            sorted[key] = encodeURIComponent((obj as { [key: string]: string })[originalKey]).replace(/%20/g, "+");
        }
        return sorted;
    }
    
}
export default new paymentsServices();
