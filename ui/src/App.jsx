/* eslint-disable react/destructuring-assignment */
/* eslint "react/react-in-jsx-scope": "off" */
/* globals React ReactDOM */
/* eslint "react/jsx-no-undef": "off" */
/* eslint "no-alert": "off" */
/* eslint linebreak-style: ["error", "windows"] */
/* eslint no-restricted-globals: "off" */
class ProductList extends React.Component {
  constructor() {
    super();
    this.state = { products: [] };
    this.createProduct = this.createProduct.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const query = `query {
    productList{
      id name Price category Image
    }
  }`;
    const response = await fetch(window.ENV.UI_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    const result = await response.json();
    this.setState({ products: result.data.productList });
  }

  async createProduct(newProduct) {
    const query = `mutation addProduct($newProduct: ProductInputs!) {
      addProduct(product: $newProduct) {
        id
      }
    }`;
    const response = await fetch(window.ENV.UI_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { newProduct } }),
    });
    if (response) { this.loadData(); }
  }

  render() {
    return (
      <React.Fragment>
        <h2>My Company Inventory</h2>
        <h4> Showing all the available products</h4>
        <hr />
        // eslint-disable-next-line react/destructuring-assignment
        <ProductTable products={this.state.products} />
        <h4>Add a new product to inventory</h4>
        <hr />
        <ProductAdd createProduct={this.createProduct} />
      </React.Fragment>
    );
  }
}


function ProductTable(props) {
  {
    // eslint-disable-next-line max-len
    const productRows = props.products.map(product => <ProductRow key={product.id} product={product} />);
    return (
      <table className="bordered-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {productRows}
        </tbody>
      </table>
    );
  }
}

function ProductRow(props) {
  {
    const { product } = props;
    return (
      <tr>

        <td>{product.name}</td>
        <td>{product.category}</td>
        <td>{product.Price}</td>
        <td><a href={product.Image} target="blank">View</a></td>

      </tr>
    );
  }
}

class ProductAdd extends React.Component {
  constructor() {
    super();

    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = { Price: '$' };
    this.handlepriceChange = this.handlepriceChange.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.productAdd;
    const product = {
      name: form.Product_Name.value,
      Price: form.Price.value.replace('$', ''),
      Image: form.Image_URL.value,
      category: form.category.value,
    };
    this.props.createProduct(product);
    form.Product_Name.value = '';
    form.Price.value = '$';
    form.Image_URL.value = '';
    form.category.value = '';
  }

  handlepriceChange() {
    this.setState({ Price: document.forms.productAdd.Price.value });
  }

  render() {
    return (

      <form name="productAdd" onSubmit={this.handleSubmit}>
        <div className="wrapper_1">
          {/* eslint jsx-a11y/label-has-associated-control: ["error", { assert: "either" } ] */}
          <label htmlFor="productname">
            Product Name:
            <br />
            <input type="text" name="Product_Name" placeholder="Product Name" id="productname" />
          </label>

          <label htmlFor="Price">
            Price Per Unit
            <br />
            <input type="text" name="Price" placeholder="Price" id="Price" defaultValue={this.state.Price} onChange={this.handlepriceChange} />
          </label>
          <br />
          <button type="submit">Add Product</button>
        </div>
        <div className="wrapper_2">
          <label htmlFor="category">
            Category
            <br />
            <select name="category" id="category">
              <option value="">Select your Category</option>
              <option value="Shirts">Shirts</option>
              <option value="Jeans">Jeans</option>
              <option value="Jackets">Jackets</option>
              <option value="Sweaters">Sweaters</option>
              <option value="Accessories">Accessories</option>
            </select>
          </label>
          <br />
          <label htmlFor="ImageURL">
            Image_URL
            <br />
            <input type="text" name="Image_URL" placeholder="URL" id="ImageURL" />
          </label>
          <br />
        </div>

      </form>

    );
  }
}

const element = <ProductList />;

ReactDOM.render(element, document.getElementById('contents'));
