import { createContext } from 'react';
import { ReactChildProp } from '../@types/typeUtils'
import { useNavigate } from 'react-router';
import useAuth from 'src/hooks/useAuth';
import { scrollToTop, toPascalCase } from 'src/utils/customFunctions';
import {
    usePostCreateChannelIdMutation,
  } from 'src/redux/splitEndpoints/postGetChannelId';

//TO DO : Find the proper type for below context
const NavContext = createContext<any | undefined>({})

export const NavProvider = ({ children }: ReactChildProp) => {
    const { authentication } = useAuth();
    const navigate = useNavigate();
    const [postGetChannelId, response] = usePostCreateChannelIdMutation();
    

     const goToSearch : any= (e: any) => {         
         if(e.target.accessKey === 'Favourite Mares') {
            navigate(`stallion-search?mareId=${e.target.id}`);
         } else if(e.target.accessKey === 'Favourite Stallions' || e.target.accessKey === 'Top 10 20/20 Matched Sires' || e.target.accessKey === 'Top 10 Perfect Match Matched Sires')
         navigate(`stallion-search?stallionId=${e.target.id}`);    
         scrollToTop();   

        //  else if(e.target.accessKey === 'Recent Searches') {
        //     const parts = e.target.id.split('~');
        //     navigate(`stallion-search?stallionId=${parts[0]}&mareId=${parts[1]}`);
        //  }
    }
    
     const goToStallionPage = (e:any) => {
        const horseId = e.currentTarget.id;
        const horseName = e.currentTarget.accessKey;
        // navigate(`/stallion-directory/stallion-page/${horseId}/View`)
        navigate(`/stallions/${toPascalCase(horseName)}/${horseId}/View`);
    }
    const goToStallionReport = (e:any) => {
        const horseId = e.currentTarget.id;
        navigate(`/report/stallion/${horseId}`)
    }
    
     const goToFarmPage = (e:any) => {
        const farmId : number = e.currentTarget.id;
        const farmName : number = e.currentTarget.accessKey;
        navigate(`/stud-farm/${toPascalCase(farmName)}/${farmId}`);
    }
     const sendMessageToBreeder = (e:any) => {
        const memberUuid = e.currentTarget.id.split('|')[0];
        const memberEmail = e.currentTarget.id.split('|')[1];
        const memberFarmId = e.currentTarget.id.split('|')[2];
        // console.log("Message: ", e.currentTarget.id);        
        let postData = {
        rxId: memberFarmId,
        txEmail: memberEmail,
        txId: memberUuid,
        stallionId: '',
        };
        postGetChannelId(postData).then((res: any) => {
        if (res?.data?.channelUuid) {
            window.sessionStorage.setItem('SessionViewOptions', 'All Messages');
            window.sessionStorage.setItem('SessionFilteredFarm', '');        
            navigate(`/messages/thread/${res?.data?.channelUuid}`);
        } 
        });
     }

     const openEditStallionProfile = (e: any) => {
        const horseId = e.currentTarget.id;        
        const horseName = e.currentTarget.accessKey;
        navigate(`/stallions/${toPascalCase(horseName)}/${horseId}/Edit`);
     }

     const goToSearchFromTrends = (e:any) => {
       if(authentication) navigate(`stallion-search?stallionId=${e.target.id}`); 
    }

    
    return(
        <NavContext.Provider value = { { navigate, goToSearch, 
        goToStallionPage, goToFarmPage, sendMessageToBreeder, goToStallionReport, 
        openEditStallionProfile, goToSearchFromTrends } }>
            {children}
        </NavContext.Provider>
    )
}

export default NavContext