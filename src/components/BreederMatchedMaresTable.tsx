import {
  StyledEngineProvider,
  Button,
} from '@mui/material';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import '../../src/utils/pagination/Pagination.css';
import { toPascalCase } from 'src/utils/customFunctions';
import {
  usePostCreateChannelIdMutation,
} from 'src/redux/splitEndpoints/postGetChannelId';
import { usePostUserMessageMutation } from 'src/redux/splitEndpoints/postUserMessageSplit';
import { useNavigate } from 'react-router';
import { useGetFarmMembersQuery } from 'src/redux/splitEndpoints/getFarmMembers';

type BreederMatchedMareProps = {
  row: any;
  stallionId: string;
};

function BreederMatchedMaresTable(props: BreederMatchedMareProps) {
  const navigate = useNavigate();
  const { row, stallionId } = props;

  // API call for farm Members List
  const { data: farmMembersList, isSuccess } = useGetFarmMembersQuery(row?.farmUuid, {
    skip: !row?.farmUuid,
  });

  // checkNomination logic
  const checkNomination =
    isSuccess && farmMembersList?.some((farm: any) => farm?.memberId === row?.farmUuid);

  //post mutation to get channelId
  const [postGetChannelId, response] = usePostCreateChannelIdMutation();
  //post mutation to get new chat
  const [postUserMessageList, responseMessageList] = usePostUserMessageMutation();

  // message Breeder Handler
  const messageBreederHandler = (row: any) => {
    let postData = {
      rxId: row?.farmUuid,
      txEmail: row?.memberEmail,
      txId: row?.memberUuid,
      stallionId: stallionId,
    };
    const farmApiData: any = {
      message: ' ',
      farmId: row?.farmUuid,
      stallionId: stallionId,
      subject: 'Report Enquiry',
      channelId: '',
      fromMemberUuid: row?.memberUuid,
    };
    postGetChannelId(postData).then((res: any) => {
      if (res?.data?.channelUuid) {
        window.sessionStorage.setItem('SessionViewOptions', 'All Messages');
        window.sessionStorage.setItem('SessionFilteredFarm', '');
        navigate(`/messages/thread/${res?.data?.channelUuid}`);
      } else {
      }
    });
  };

  return (
    <>
      <StyledEngineProvider injectFirst>
        <TableRow key={row.horse} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
          <TableCell align="left">{toPascalCase(row.BreederName)}</TableCell>
          <TableCell align="left">{row.CountryName}</TableCell>
          <TableCell align="left" className="matched-dam">
            {row.TotalCountSearch}
          </TableCell>
          <TableCell align="left" className="matched-yob">
            {row.TotalCount2020Match}
          </TableCell>
          <TableCell align="left" className="matched-prize">
            {toPascalCase(row.marename)}
          </TableCell>
          <TableCell align="left">
            {row?.farmUuid && row?.memberUuid && !checkNomination && row?.isFarmUser === 0 && (
              <Button
                type="button"
                className="Messge-Breeder-Btn"
                onClick={() => messageBreederHandler(row)}
              >
                <i className="icon-Chat" />
                Message Breeder
              </Button>
            )}
          </TableCell>
        </TableRow>
      </StyledEngineProvider>
    </>
  );
}
export default BreederMatchedMaresTable;
