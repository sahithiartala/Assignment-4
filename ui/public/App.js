class ProductList extends React.Component {
  constructor() {
    super();
    this.state = {
      products: []
    };
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
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query
      })
    });
    const result = await response.json();
    this.setState({
      products: result.data.productList
    });
  }

  async createProduct(product) {
    const query = `mutation addProduct($product: ProductInputs!) {
      addProduct(product: $product) {
        id
      }
    }`;
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        variables: {
          product
        }
      })
    });

    if (response) {
      this.loadData();
    }
  }

  render() {
    return React.createElement(React.Fragment, null, React.createElement("h2", null, "My Company Inventory"), React.createElement("h4", null, " Showing all the available products"), React.createElement("hr", null), React.createElement(ProductTable, {
      products: this.state.products
    }), React.createElement("h4", null, "Add a new product to inventory"), React.createElement("hr", null), React.createElement(ProductAdd, {
      createProduct: this.createProduct
    }));
  }

}

function ProductTable(props) {
  {
    const productRows = props.products.map(product => React.createElement(ProductRow, {
      key: product.id,
      product: product
    }));
    return React.createElement("table", {
      className: "bordered-table"
    }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Product Name"), React.createElement("th", null, "Category"), React.createElement("th", null, "Price"), React.createElement("th", null, "Image"))), React.createElement("tbody", null, productRows));
  }
}

function ProductRow(props) {
  {
    const product = props.product;
    return React.createElement("tr", null, React.createElement("td", null, product.name), React.createElement("td", null, product.category), React.createElement("td", null, product.Price), React.createElement("td", null, React.createElement("a", {
      href: product.Image,
      target: "_blank"
    }, "View")));
  }
}

class ProductAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      Price: '$'
    };
    this.handlepriceChange = this.handlepriceChange.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.productAdd;
    const product = {
      name: form.Product_Name.value,
      Price: form.Price.value.replace('$', ''),
      Image: form.Image_URL.value,
      category: form.category.value
    };
    this.props.createProduct(product);
    form.Product_Name.value = "";
    form.Price.value = "$", form.Image_URL.value = "";
    form.category.value = "";
  }

  handlepriceChange() {
    this.setState({
      Price: document.forms.productAdd.Price.value
    });
  }

  render() {
    return React.createElement("form", {
      name: "productAdd",
      onSubmit: this.handleSubmit
    }, React.createElement("div", {
      className: "wrapper_1"
    }, React.createElement("label", null, " Product Name:"), React.createElement("br", null), React.createElement("input", {
      type: "text",
      name: "Product_Name",
      placeholder: "Product Name"
    }), React.createElement("br", null), React.createElement("label", null, "Price Per Unit "), " ", React.createElement("br", null), React.createElement("input", {
      type: "text",
      name: "Price",
      placeholder: "Price",
      defaultValue: this.state.Price,
      onChange: this.handlepriceChange
    }), React.createElement("br", null), React.createElement("button", {
      type: "submit"
    }, "Add Product")), React.createElement("div", {
      className: "wrapper_2"
    }, React.createElement("label", null, "Category"), React.createElement("br", null), React.createElement("select", {
      name: "category"
    }, React.createElement("option", {
      value: ""
    }, "Select your Category"), React.createElement("option", {
      value: "Shirts"
    }, "Shirts"), React.createElement("option", {
      value: "Jeans"
    }, "Jeans"), React.createElement("option", {
      value: "Jackets"
    }, "Jackets"), React.createElement("option", {
      value: "Sweaters"
    }, "Sweaters"), React.createElement("option", {
      value: "Accessories"
    }, "Accessories")), " ", React.createElement("br", null), React.createElement("label", null, "Image_URL"), React.createElement("br", null), React.createElement("input", {
      type: "text",
      name: "Image_URL",
      placeholder: "URL"
    }), React.createElement("br", null)));
  }

}

const element = React.createElement(ProductList, null);
ReactDOM.render(element, document.getElementById('contents'));