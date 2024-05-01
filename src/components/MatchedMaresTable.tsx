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

type MatchedMareProps = {
  row: any;
  stallionId: string;
};

function MatchedMaresTable(props: MatchedMareProps) {
  const navigate = useNavigate();
  const { row, stallionId } = props;

  // get all members against a farm Id API call
  const { data: farmMembersList, isSuccess } = useGetFarmMembersQuery(row?.farmid, {
    skip: !row?.farmid,
  });

  const checkNomination =
    isSuccess && farmMembersList?.some((farm: any) => farm?.memberId === row?.farmid);

  //post mutation to get channelId
  const [postGetChannelId, response] = usePostCreateChannelIdMutation();

  //post mutation to get new chat
  const [postUserMessageList, responseMessageList] = usePostUserMessageMutation();

  const messageBreederHandler = (row: any) => {
    let postData = {
      rxId: row?.farmid,
      txEmail: row?.memberemail,
      txId: row?.createdby,
      stallionId: stallionId,
    };
    
    postGetChannelId(postData).then((res: any) => {
      if (res?.data?.channelUuid) {
        window.sessionStorage.setItem('SessionViewOptions', 'All Messages');
        window.sessionStorage.setItem('SessionFilteredFarm', '');
        navigate(`/messages/thread/${res?.data?.channelUuid}`);
      } 
    });
  };

  return (
    <>
      <StyledEngineProvider injectFirst>
        <TableRow key={row.horse} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
          <TableCell align="left">{row.mareName ? toPascalCase(row.mareName) : '-'}</TableCell>
          <TableCell align="left">{row.sireName ? toPascalCase(row.sireName) : '-'}</TableCell>
          <TableCell align="left" className="matched-dam">
            {row?.damName ? toPascalCase(row?.damName) : '-'}
          </TableCell>
          <TableCell align="left" className="matched-yob">
            {row?.yob ? row?.yob : '-'}
          </TableCell>
          <TableCell align="left" className="matched-prize">{`${row.currencySymbol ? row.currencySymbol : ''}${
            (row.totalPrizeMoneyEarned != 0 && row.totalPrizeMoneyEarned !== null)
              ? Number(row.totalPrizeMoneyEarned).toLocaleString()
              : '-'
          }`}</TableCell>
          <TableCell align="left">
            {row?.farmid && row?.createdby && !checkNomination && (
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
export default MatchedMaresTable;