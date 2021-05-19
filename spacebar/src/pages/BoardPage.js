import { makeStyles, Typography, Card, Container } from "@material-ui/core";
import Item from "../components/Item.js";
const useStyles = makeStyles({
  btn: {},
});
export default function BoardPage() {
  return (
    <Container>
      <Item />
    </Container>
  );
}
