import Profile from "./containers/Profile.tsx";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";

function Index() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Profile/>
    </LocalizationProvider>
  );
}

export default Index;