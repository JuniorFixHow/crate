import { IMember } from "@/lib/database/models/member.model";
import { IQuestion } from "@/lib/database/models/question.model";
import { IResponse } from "@/lib/database/models/response.model";
import { ISection } from "@/lib/database/models/section.model";

export type ViewProps = 'By Question'|'By Respondent';

export const SearchResponses = (responses:IResponse[], search:string, sectionId:string, viewmode:ViewProps):IResponse[]=>{
    const data  = responses
    .filter((response)=>{
        const section = response?.sectionId as ISection;
        return (sectionId === '' || sectionId === undefined) ? response : section?._id === sectionId
    })
    .filter((response)=>{
        const member = response?.memberId as IMember;
        const question = response?.questionId as IQuestion;
        return search === '' ?  response : Object.values(viewmode==='By Question' ? question : member)
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
        // if(viewmode === 'By Question'){
        // }
    })

    return data;
}

export const SearchQuestion = (questions:IQuestion[], sectionId:string, search:string):IQuestion[]=>{
    const data = questions
    .filter((question)=>{
        // const section = question?.sectionId as ISection;
        return (sectionId === '' || sectionId === undefined) ? question : question?.sectionId.toString() === sectionId
    })
    .filter((question)=>{
        return search === '' ?  question : Object.values(question )
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
    })

    return data;
}

export const SearchResponseMember = (responses:IResponse[], sectionId:string, search:string):IResponse[]=>{
    const data = responses
    .filter((response)=>{
        const section = response?.sectionId as ISection;
        return (sectionId === '' || sectionId === undefined) ? response : section?._id === sectionId
    })
    .filter((response)=>{
        const member = response?.memberId as IMember
        return search === '' ?  response : Object.values(member )
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
    })

    return data;
}

export const SearchResponseMemberWithoutSection = (members:IMember[], search:string):IMember[]=>{
    const data = members
    .filter((member)=>{
        return search === '' ?  member : Object.values(member )
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
    })

    return data;
}


export const SearchResponseWithJustSection = (responses:IResponse[], sectionId:string):IResponse[]=>{
    const data = responses
    .filter((response)=>{
        const section = response.sectionId as ISection;
        return (sectionId === '' || sectionId === undefined) ? response : sectionId === section?._id;
    })

    return data;
}