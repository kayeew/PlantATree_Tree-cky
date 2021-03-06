import React, { Component } from "react";
import './ViewTree.css';
import axios from "axios";
import { withRouter } from 'react-router'
import { MDBBtn, MDBCol, MDBCardImage, MDBRow, MDBNavLink, MDBContainer } from 'mdbreact';

class ViewTree extends Component {
  state = {
    id: '',
    name: "",
    price: "",
    description: "",
    category: "",
    conditionsOfPlace: "",
    maintanceRequirements: "",
    maxHeight: "",
    growthRate: "",
    imageURL: "",
    response: ""
  };

  onChangeHandler = e => this.setState({ [e.target.name]: e.target.value });

  async componentDidMount() {
    try {
      let search =  this.props.location.search,
        id = search.substring(1, search.length);

      const updateTree = await axios(`/api/trees/${id}`);

      const { 
        name, 
        price, 
        description, 
        category, 
        conditionsOfPlace, 
        maintanceRequirements, 
        maxHeight, 
        growthRate, 
        imageURL 
      } = updateTree.data.tree;

      this.setState({ 
        id, 
        name, 
        price, 
        description, 
        category, 
        conditionsOfPlace, 
        maintanceRequirements, 
        maxHeight, 
        growthRate, 
        imageURL 
      });
    } catch (err) {
        this.setState({ response: "Tree not found!" })
    }
  };

  updateTreeHandler = async (e) => {
    e.preventDefault();
    try {
      const tree = await axios.put(`/api/trees/${this.state.id}`, {
        name: this.refs.name.value,
        price: Number(this.refs.price.value),
        description: this.refs.description.value,
        category: this.refs.category.value,
        conditionsOfPlace: this.refs.conditionsOfPlace.value,
        maintanceRequirements: this.refs.maintanceRequirements.value,
        maxHeight: this.refs.maxHeight.value,
        growthRate: this.refs.growthRate.value,
        imageURL: this.refs.imageURL.value
      });
      this.setState({response: tree.data.message });
    } catch (err) {
      this.setState({ response: err.message });
    }
  };

  handleSubmitTree = async (e) => {
    e.preventDefault();
    try {
        axios.post(`/api/cart/added`, {
        id: this.state.id,
        name: this.state.name,
        price: this.state.price,
        imageURL: this.state.imageURL,
        quantity: 1
      });

      this.setState({ response: "Tree added" });
    } catch (err) {
      this.setState({ response: err.message });
    }
  }


  render() {
    if (this.state.response === "Tree not found!")
      return <h1>Tree not found!</h1>

    return (
      <div className="View-Tree-Wrapper"> 
        <MDBContainer>
          <MDBRow>
            <MDBCol>
              <MDBCardImage className="Tree-Image" src={ this.state.imageURL } alt="tree photo" overlay="white-slight" />
            </MDBCol>
            <MDBCol className="Tree-Details">
              <h1>{ this.state.name }</h1>
              <h2>${ this.state.price }</h2>
              <strong>Description:</strong><br />
              { this.state.description }<br />

              <strong>Category:</strong><br />
              { this.state.category }<br />

              <strong>Conditions Of Place:</strong><br />
              { this.state.conditionsOfPlace }<br />

              <strong>Maintance Requirements:</strong><br />
              { this.state.maintanceRequirements }<br />

              <strong>Max Height:</strong><br />
              { this.state.maxHeight }<br />

              <strong>Growth Rate:</strong><br />
              { this.state.growthRate }<br /><br />
              
                <form onSubmit={this.handleSubmitTree}>
                  <MDBBtn type="submit">Add to Cart</MDBBtn>
                </form>
                <MDBRow>
                <MDBNavLink to="/">
                  <MDBBtn>Back</MDBBtn>
                </MDBNavLink>
                <MDBNavLink 
                  to={{
                    pathname: '/landscapemockup',
                    plant: {
                      imageURL: this.state.imageURL,
                      plantID: this.state.id
                    }
                  }}>
                  <MDBBtn>Landscape Mockup View</MDBBtn>
                </MDBNavLink>
              </MDBRow>
              { this.state.response }
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
    );
    
  }
}

export default withRouter(ViewTree);
