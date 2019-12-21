import React from "react";
import MenuBar from "./navbar";
import "../css/project.css";
import axios from "axios";
import { Card, Button } from "react-bootstrap";

const EachProject = props => {
  return (
    <Card style={{ width: "18rem", marginTop: "" }}>
      <Card.Img variant="top" src={Object(props.owner).avatar_url} />
      <Card.Body>
        <Card.Title>{props.project.name}</Card.Title>
        <Card.Text>Owner : {/*props.project.owner*/}</Card.Text>
        <Card.Text> : {/*props.project.owner*/}</Card.Text>
        <Button variant="primary" href={props.project.html_url}>
          Go somewhere
        </Button>
      </Card.Body>
    </Card>
  );
};

class Project extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: []
    };
  }

  componentDidMount() {
    axios
      .get("https://api.github.com/users/os-ucsd/repos")
      .then(res => {
        this.setState({ projects: res.data });
      })
      .catch(error => console.log(error));
  }

  showProject() {
    return Object(this.state.projects).map(project => {
      return <EachProject project={project} key={project.id} />;
    });
  }

  render() {
    return (
      <div>
        <MenuBar />
        {console.log(Object(Object(this.state.projects[0]).owner).avatar_url)}
        <p>This is project page</p>
        <div className="project">{this.showProject()}</div>
      </div>
    );
  }
}

export default Project;
