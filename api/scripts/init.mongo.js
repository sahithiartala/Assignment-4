const productDB = [
    {
        id:1,category: 'Shirts', name: 'Blue Shirt', Price: 60.00,Image:'https://www.superdry.com/us/mens/jackets/details/153408/skate-luxe-coach-jacket--navy'
    },
    {
        id: 2,category: 'Accessories', name: 'Scarf ', Price: 20.00, Image:'https://www.gap.com/browse/product.do?pid=546615022#pdp-page-content'
    },
    {
        id: 3,category: 'Jackets', name: 'Leather jacket', Price: 210.00,     Image:'https://www.everlane.com/products/womens-leather-flight-jacket-mellowpink?locale=US&utm_medium&utm_source=pla-google&utm_campaign=838503582&utm_content=408119694860&utm_term=aud-492596540375:pla-837884946428&adgroup=90496873874&pid=6803-48009&device=c&gclid=Cj0KCQiAtOjyBRC0ARIsAIpJyGORgeKDYeVjQzHW6LL2d9_30MzWd_ayNK4e33WDeGYfNB850kWF7SIaAv3tEALw_wcB'
    }
  ];

db.products.insertMany(productDB);
const count = db.products.count();
print('Inserted', count, 'products');


db.counters.remove({ _id: 'products' });
db.counters.insert({ _id: 'products', current: count });

db.products.createIndex({ id: 1 }, { unique: true });
db.products.createIndex({ category: 1 });
db.products.createIndex({ name: 1 });
db.products.createIndex({ Price: 1 });
db.products.createIndex({ Image: 1 });