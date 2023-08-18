import { OnLoadUtils, CheckAuthValidity } from "../../components/helpers/helpers";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

export default function Profile() {

  function Tst() {
    console.log("AAA");
    CheckAuthValidity();
  }

  return (
    <Container>
      <Button onClick={Tst} variant="outlined">
        Teste
      </Button>

      <Box id="userImage">
        imagem
      </Box>

      <Box id="userEmail">
        e-mail
      </Box>
      <OnLoadUtils />
    </Container>
  );
}
