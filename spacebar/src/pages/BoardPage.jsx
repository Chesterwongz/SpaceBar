import { Container, makeStyles } from "@material-ui/core";
import KanbanList from "../components/KanbanBoard/KanbanList";
const useStyles = makeStyles({
  btn: {},
});
export default function BoardPage() {
  return <KanbanList />;
}
