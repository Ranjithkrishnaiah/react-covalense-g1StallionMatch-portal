import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useMailPreviewQuery } from "src/redux/splitEndpoints/mailPreviewSplit";
import { Spinner } from "./Spinner";


export default function MailPreview() {
    const { dirIdentity = '', fileIdentity = '' } = useParams();
    const navigate = useNavigate();
    const { data, isSuccess, isFetching, isError } = useMailPreviewQuery({ dirIdentity, fileIdentity });
    
    useEffect(() => {
        if (isSuccess) {
            window.location.href = data?.emailPreview;            
        }
        if (isError) {
            navigate('*');
        }
    }, [isFetching, data])

    return (
        <>
            <h1><Spinner/></h1>
        </>
    )
}