import { Box } from '@mui/material';
import { useState, useEffect, useMemo, forwardRef } from 'react';
import { useNavigate } from 'react-router';
import DropdownTreeSelect from 'react-dropdown-tree-select';
import { transformResponse } from 'src/utils/FunctionHeap';
import '../countryStateDropdown/CountryState.css';
type TypedMultiSelectProps = {
  
  placeholder: string;
  data: any[];
  from: string;
  values: any[];
  returnFunction: React.Dispatch<React.SetStateAction<any[]>>;
  ref?: any;
  selectedPrefilledData?: any[],
  cartInfo?: any,
  noMatches?: string
  selectedPlaceholder?:string;
  selectedId?:any;
}
const TypedMultiSelect = forwardRef<React.MutableRefObject<any>, TypedMultiSelectProps>(({ placeholder, selectedPrefilledData, data, from, values, returnFunction, cartInfo, noMatches,selectedPlaceholder, selectedId }, ref) => {
  const [Data, setData] = useState(transformResponse(data, from));
  const navigate = useNavigate();
  const onChange = async (currentNode: any, selectedNodes: any) => {
    const selectedData = await selectedNodes.map((res: any) => res.id);
    if (selectedPrefilledData) {
      returnFunction([...selectedData])
    } else {
      returnFunction([...values, ...selectedData])
    }
  }
  const Ref: any = ref;
  const [user, setUser] = useState<any>();
  useEffect(() => {
    // let SampleData = {
    //   id: 12,
    //   name: 'Sample',
    // };
    if (localStorage.getItem('user') !== null) {
      setUser(JSON.parse(localStorage.getItem('user') || '{}'));
    }
  }, []);
  // console.log(transformResponse(data, from), 'Data transform')
  useEffect(() => {
    if (selectedPrefilledData && selectedPrefilledData.length) {
      let data1 = [];
      if (cartInfo === undefined && from === 'STALLION-PRO-REPORT') {
        data1 = Data.map((v: any, i: number) => {
          for (let index = 0; index < selectedPrefilledData.length; index++) {
            const element = selectedPrefilledData[index];
            if (element === v.id) {
              v.checked = true;
            }
          }
          return v;
        })
      } else {
        if (from !== 'SALES-CATALOG-REPORT') {
          console.log(Data, 'else called >>> Data')
          data1 = Data.map((v: any, i: number) => {
            for (let index = 0; index < selectedPrefilledData.length; index++) {
              const element = selectedPrefilledData[index];
              if (element.id === v.id) {
                v.checked = true;
              }
            }
            return v;
          })
        }
      }
      let dataSelected: any = [];
      data1.forEach(element => {
        if (element.checked) {
          dataSelected.push(element.id);
        }
      });
      setData(data1);
      returnFunction([...dataSelected])
    } else {
      if (cartInfo === undefined && (from === 'STALLION-PRO-REPORT'|| from === "Stallion-Shortlist-Report")) {
        let data1 = [];
        data1 = Data.map((v: any, i: number) => {
          v.checked = true;
          return v;
        })
        let dataSelected: any = [];
        data1.forEach(element => {
          if (element.checked) {
            dataSelected.push(element.id);
          }
        });
        returnFunction([...dataSelected])
        setData(data1);
      }
    }
    
  }, [])

  useEffect(() => {
    if (from === 'SALES-CATALOG-REPORT') {
      // console.log(user, cartInfo, 'USER >')
      if (selectedPrefilledData && selectedPrefilledData.length) {
        if (cartInfo) {
          let data1: any = [];

          setData(transformResponse(user?.myFarms, from));
          if (user?.myFarms?.length > 0) {
            // console.log(transformResponse(user?.myFarms, from), 'else called >>> Data')
            data1 = transformResponse(user?.myFarms, from)?.map((v: any, i: number) => {
              for (let index = 0; index < selectedPrefilledData.length; index++) {
                const element = selectedPrefilledData[index];
                if (element.id === v.id) {
                  v.checked = true;
                }
              }
              return v;
            })
          }
          let dataSelected: any = [];
          data1.forEach((element: any) => {
            if (element.checked) {
              dataSelected.push(element.id);
            }
          });

          setData(data1);
          returnFunction([...dataSelected])
        }
      }
    }

  }, [user?.myFarms])



  // useEffect(() => {
    // document.getElementsByClassName("dropdown-trigger")[0].getElementsByTagName("input")[0].addEventListener("keydown", function (event) {
    //   setTimeout(function () {
    //     if (!document.getElementsByClassName("no-matches")[0]) return
    //     // @ts-ignore
    //     if (document.getElementsByClassName("no-matches")[0].innerText == 'No stallions in your shortlist') {
    //       // @ts-ignore
    //       document.getElementsByClassName("no-matches")[0].innerText = ''
    //       document.getElementsByClassName("no-matches")[0].innerHTML += "<div style = 'margin-left: 15px ; margin-top: -20px ; font-size: 15px'> No stallions in your shortlist. Add new <span id = 'no_shortlist_121' style = 'color: -webkit-link; cursor: pointer; text-decoration: underline;'> here </span> </div>"
    //       // @ts-ignore
   
    //       document.getElementsByClassName("no-matches")[0].getElementsByTagName("span")[0].addEventListener("click", function (event) {
    //         navigate('/stallion-directory')
    //       })
    //     }
    //   }, 500)
    // })
    // document.getElementsByClassName("dropdown-trigger")[0].getElementsByTagName("input")[0].addEventListener("input", function (event) {
    //   setTimeout(function () {
    //     if (!document.getElementsByClassName("no-matches")[0]) return
    //     // @ts-ignore
    //     if (document.getElementsByClassName("no-matches")[0].innerText == 'No stallions in your shortlist') {
    //       // @ts-ignore
    //       document.getElementsByClassName("no-matches")[0].innerText = ''
    //       document.getElementsByClassName("no-matches")[0].innerHTML += "<div  style = 'margin-left: 15px ; margin-top: -20px ; font-size: 15px'> No stallions in your shortlist. Add new <span id = 'no_shortlist_121' style = 'color: -webkit-link; cursor: pointer; text-decoration: underline;'> here </span> </div>"
    //       // @ts-ignore
 
    //       document.getElementsByClassName("no-matches")[0].getElementsByTagName("span")[0].addEventListener("click", function (event) {
    //         navigate('/stallion-directory')
    //       })
    //     }
    //   }, 0)

    // })
  // }, [document.getElementsByClassName("no-matches")[0], document.getElementsByClassName("dropdown-trigger")[0], document.getElementsByClassName("dropdown-trigger")[0] && document.getElementsByClassName("dropdown-trigger")[0].getElementsByTagName("input")[0]])


  if (values?.length > 0 && Ref?.current?.searchInput.getAttribute("placeholder").length > 0) {
    Ref?.current?.searchInput.setAttribute("placeholder", selectedPlaceholder?selectedPlaceholder:"");
    
  } else if (values?.length == 0 && Ref?.current?.searchInput.getAttribute("placeholder").length > 0) {
    Ref?.current?.searchInput.setAttribute("placeholder", placeholder);
  }
  let checkItisOpen = document.querySelectorAll('.dropdown-trigger.arrow.bottom');
    // console.log(checkItisOpen,'Ref>>')
    if(checkItisOpen?.length === 1 && selectedId != 0) {
      Ref?.current?.searchInput.setAttribute("placeholder", placeholder);
    }

  const DropDownTreeSelect = useMemo(() => {
    return (
      <DropdownTreeSelect
        aria-hidden="true"
        data={Data || []}
        onChange={onChange}
        className="mdl-demo"
        texts={{ placeholder: placeholder, noMatches: noMatches ? noMatches : 'No matches found' }}
        ref={Ref}
      />
    );
  }, [Data]);

  return <Box className="SDmultiselect">{DropDownTreeSelect}</Box>;
})
export default TypedMultiSelect
