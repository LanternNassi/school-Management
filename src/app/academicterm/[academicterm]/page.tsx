/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import React from 'react'
import Custom_Axios from '@/components/CustomAxios'
import { IAcademicTermSchema } from '@/schema/IAcademicTermSchema'
import "./page.css"

import { CircularProgress, Typography, Card, CardHeader, CardContent , Divider } from "@mui/material";

export default function page({params} : {params: {academicterm : string}}) {
    
    const [term , setTerm] = React.useState<IAcademicTermSchema | null>(null)


    const GetTermInfo = (term_id : string) : void => {
        Custom_Axios()
            .get(`/Terms/${term_id}`)
            .then((response) => {
                if (response.status == 200){
                    setTerm(response.data)
                }
            })
    }

    React.useEffect(() => {
        GetTermInfo(params.academicterm)
    } , [])

    if (term == null){
        return (
            <div className={'spinner_ov'}>
                <CircularProgress/>
            </div>
        )
    }


    return (
    <div className={'termcontainer'}>
        <Card className={'term-panel-info'}>
            <CardHeader title={`${term.name}`}></CardHeader>
            <CardContent>
                <div style={{height:'7dvh' , width:'68dvw'}}>
                    <Typography sx={{fontSize:16, fontWeight : 'bold'}}>
                        Term Information
                    </Typography>
                </div>
                <div className={'termInfo'}>
                    <Typography sx={{fontSize:14}} color="text.primary">
                    {`Name : ${term.name}`}
                    </Typography>
                    <Typography sx={{fontSize:14}} color="text.primary">
                    {`Description : ${term.description}`}
                    </Typography>
                    <Typography sx={{fontSize:14}} color="text.primary">
                    {`Name : ${term.name}`}
                    </Typography>
                    <Typography sx={{fontSize:14}} color="text.primary">
                    {`Name : ${term.name}`}
                    </Typography>
                    <Typography sx={{fontSize:14}} color="text.primary">
                    {`Name : ${term.name}`}
                    </Typography>

                </div>
            </CardContent>
        </Card>

        <Card className={'term-panel-meta'}>
            <CardHeader title={`Meta data`}></CardHeader>
            <CardContent>
                
            </CardContent>

        </Card>

    </div>
  )
}

