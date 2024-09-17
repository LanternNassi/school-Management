/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React from "react";
import "./page.css";
import Custom_Axios from "@/components/CustomAxios";
import { IStudentSchema } from "@/schema/IStudentSchema";
import { IStreamSchema } from "@/schema/IStreamSchema";
import { IClassSchema } from "@/schema/IClassSchema";
import { CircularProgress, Typography, Card, CardHeader, CardContent , Divider } from "@mui/material";
import { toDDMMYYYY } from "@/Utils/ConvertDateTime";
import NormalTable from "@/components/Tables/NormalTable";
import ITableHeaderSchema from "@/schema/ITableHeaders";
import { IFeesStructureSchema } from "@/schema/IFeesStructureSchema";
import FormatMoney from "@/Utils/MoneyFormatter";
import ReceiptIcon from "@mui/icons-material/Receipt";



import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import { ITransactionsSchema } from "@/schema/ITransactionsSchema";



export default function page({ params }: { params: { student: string } }) {
  const [Student, setStudent] = React.useState<IStudentSchema | null>(null);
  const [Stream , setStream] = React.useState<IStreamSchema | null>(null)
  const [Class , setClass] = React.useState<IClassSchema | null>(null)
  const [headers, setheaders] = React.useState<ITableHeaderSchema[]>([]);

  const [fees , setfees] = React.useState<IFeesStructureSchema[]>([])
  const [selectedstructs , setselectedstructs] = React.useState<string[]>([])
  const [activeStruct , setActivestruct] = React.useState<IFeesStructureSchema | null>(null)
  const [edit , setedit] = React.useState<boolean>(false)

  const [transactions , settransactions] = React.useState<ITransactionsSchema[]>([
    {
      id : "aalalaa",
      studentFeesStructureId : "aksdieoe",
      amount : 20000,
      studentFeesStructure : null,
      deletedAt : "sss",
      addedAt : "2024-07-15T09:34:25.843227",
      updatedAt : "ajcclc"
    },
    {
      id : "aalalaa",
      studentFeesStructureId : "aksdieoe",
      amount : 30000,
      studentFeesStructure : null,
      deletedAt : "sss",
      addedAt : "2024-07-15T09:34:25.843227",
      updatedAt : "ajcclc"
    },
    {
      id : "aalalaa",
      studentFeesStructureId : "aksdieoe",
      amount : 50000,
      studentFeesStructure : null,
      deletedAt : "sss",
      addedAt : "2024-07-15T09:34:25.843227",
      updatedAt : "ajcclc"
    },
    {
      id : "aalalaa",
      studentFeesStructureId : "aksdieoe",
      amount : 80000,
      studentFeesStructure : null,
      deletedAt : "sss",
      addedAt : "2024-07-15T09:34:25.843227",
      updatedAt : "ajcclc"
    }
  ])

  const GetStudentById = () => {
    Custom_Axios()
      .get(`/Students/${params.student}`)
      .then((response) => {
        if (response.status == 200) {
          setStudent(response.data);
          GetStreamById(response.data['streamId'])
        }
      });
  };

  const GetStudentFees = () => {
    Custom_Axios()
      .get(`/StudentFeesStructure`)
      .then((response) => {
        if (response.status == 200){
          setfees(response.data)
        }
      })
  }

  const GetStructById = (id : string) => {
    Custom_Axios()
      .get(`/StudentFeesStructure/${id}`)
      .then((response) => {
        if (response.status == 200){
          setActivestruct(response.data)
        }
      })
  }

  const OnSelection = (e: string[]) => {
    setselectedstructs(e);
    GetStructById(e[0]);
  };

  const toggleEditDrawer = (newOpen: boolean) => {
    setedit(newOpen);
  };

  const createheaders = (): void => {
    const headers: ITableHeaderSchema<IFeesStructureSchema>[] = [
      
      {
        id: "AcademicTerm",
        numeric: false,
        disablePadding: true,
        label: "Academic Term",
        alignment: "left",
        resolver: (row) => `${row.term.name}`,
      },
      {
        id: "Amount",
        numeric: false,
        disablePadding: true,
        label: "Fees Amount",
        alignment: "left",
        resolver: (row) => FormatMoney(row.amount)
      },
      {
        id: "Amount Paid",
        numeric: false,
        disablePadding: true,
        label: "Amount Paid",
        alignment: "left",
        resolver: (row) => "shs.200,000",
      },
      {
        id : "Paid",
        numeric : false,
        disablePadding : true,
        label : "Paid",
        alignment : "left",
        resolver : (row) => row.isPaid? ('Paid') : ('Not Paid')
      },
      {
        id : "Date Added",
        numeric : false,
        disablePadding : true,
        label : "Date assigned",
        alignment : "left",
        resolver : (row) => toDDMMYYYY(row.addedAt)
      },
      {
        id : "DateUpdated",
        numeric : false,
        disablePadding : true,
        label : "Last Updated",
        alignment : "left",
        resolver : (row) => toDDMMYYYY(row.updatedAt)
      }


      
    ];

    setheaders(headers);
  };

  const GetStreamById = (id : string) => {
    Custom_Axios()
      .get(`/Streams/${id}`)
      .then((response) => {
        if (response.status == 200){
          setStream(response.data);
          GetClassById(response.data['classId']);
        }
      })
  }

  const GetClassById = (id : string) => {
    Custom_Axios()
      .get(`/Classes/${id}`)
      .then((response) => {
        if (response.status == 200){
            setClass(response.data)
        }
      })
  }

  

  React.useEffect(() => {
    GetStudentById();
    GetStudentFees()
    createheaders();
  }, []);

  const Transactions = () => {
    if (transactions.length < 0){
      return (
        <div className="spinner-student">
          <CircularProgress />
        </div>
      )
    }



    return (
      <List sx={{ width: "27vw", minHeight: "30vh" }}>
      {transactions.map(({ amount , addedAt}, index) => {
        return (
          <ListItem
            key={index}
            secondaryAction={
              <Typography
                sx={{ fontSize: 14 }}
                color="text.primary"
                gutterBottom
              >
                {toDDMMYYYY(addedAt)}
              </Typography>
            }
            disablePadding
          >
            <ListItemButton>
              <ListItemIcon>
                <ReceiptIcon />
              </ListItemIcon>
              <ListItemText primary={FormatMoney(amount)} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
    )
  }

  if (Student == null) {
    return (
      <div className="spinner-student">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="student-body">
      <div className="space" />
      <div className="st-panel-1">
        <Card className="student-info">
          <CardHeader
            title={`${Student.firstName} ${Student.otherNames}`}
          ></CardHeader>
          <CardContent>
            <div style={{height:`7dvh` , width : '65dvw'}}>
              <Typography sx={{fontSize: 16, fontWeight :"bold"}}>
                Student Profile Information
              </Typography>
            </div>
              <div className={"userInfo"}>
                <Typography sx={{fontSize:14}} color="text.primary">
                  {`Student ID : ${Student.id}`}
                </Typography>
                <Typography sx={{fontSize:14}} color="text.primary">
                  {`Name : ${Student.firstName} ${Student.otherNames}`}
                </Typography>
                <Typography sx={{fontSize:14}} color="text.primary">
                  {`Pay Code : ${Student.payCode}`}
                </Typography>
                <Typography sx={{fontSize:14}} color="text.primary">
                  {`Class: ${Class?.name} ${Stream?.name}`}
                </Typography>
                <Typography sx={{fontSize:14}} color="text.primary">
                  {`Date Added: ${toDDMMYYYY(Student.addedAt)}`}
                </Typography>
                <Typography sx={{fontSize:14}} color="text.primary">
                  {`Date Updated: ${toDDMMYYYY(Student.updatedAt)}`}
                </Typography>
              </div>

              <div className="space"/>

              <div style={{height:`7dvh` , width : '65dvw'}}>
              <Typography sx={{fontSize: 16, fontWeight :"bold"}}>
                Student Fees Structure
              </Typography>
            </div>

            <div className="contactTable">
            <NormalTable
              heading={"Fees Structure"}
              OnSelection={OnSelection}
              headers={headers}
              table_rows={fees}
            />
          </div>

          </CardContent>
        </Card>

        <Card className="student-payments">
          <CardHeader title={`Last Payments for ${activeStruct? activeStruct.term.name : `all`}`} />
          <CardContent>
              <Transactions/>
              <Divider/>
              <div style={{
                height : '8dvh',
                width : '28dvw',
                display : 'flex',
                flexDirection : 'row',
                alignItems : 'center',
                justifyContent : 'flex-end'
              }}>
                  <Typography>
                    TOTAL : shs.200,000
                  </Typography>
              </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
