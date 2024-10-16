/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { ReactNode } from "react";
import "./page.css";
import Custom_Axios from "@/components/CustomAxios";
import { IStudentSchema } from "@/schema/IStudentSchema";
import { IStreamSchema } from "@/schema/IStreamSchema";
import { IClassSchema } from "@/schema/IClassSchema";
import {
  CircularProgress,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import { toDDMMYYYY } from "@/Utils/ConvertDateTime";
import NormalTable from "@/components/Tables/NormalTable";
import ITableHeaderSchema from "@/schema/ITableHeaders";
import { IFeesStructureSchema } from "@/schema/IFeesStructureSchema";
import FormatMoney from "@/Utils/MoneyFormatter";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import { FeedBackProps, FeedBack } from "@/components/FeedBack";
import { IAcademicTermSchema } from "@/schema/IAcademicTermSchema";
import { IPostITransactionsSchema, ITransactionsSchema } from "@/schema/ITransactionsSchema";

import Edit from "@/components/Edit";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";

export default function page({ params }: { params: { student: string } }) {
  const [Student, setStudent] = React.useState<IStudentSchema | null>(null);
  const [Stream, setStream] = React.useState<IStreamSchema | null>(null);
  const [Class, setClass] = React.useState<IClassSchema | null>(null);
  const [headers, setheaders] = React.useState<ITableHeaderSchema[]>([]);

  const [terms, setterms] = React.useState<IAcademicTermSchema[]>([]);
  const [fees, setfees] = React.useState<IFeesStructureSchema[]>([]);
  const [selectedstructs, setselectedstructs] = React.useState<string[]>([]);
  const [activeStruct, setActivestruct] =
    React.useState<IFeesStructureSchema | null>(null);
  const [edit, setedit] = React.useState<boolean>(false);
  const [submitting, setsubmitting] = React.useState<boolean>(false);
  const [feesEdit, setFeesEdit] = React.useState<boolean>(false);
  const [transactionsEdit, setTransactionsEdit] = React.useState<boolean>(false);
  const [feedBack, setFeedBack] = React.useState<FeedBackProps | null>(null);
  const [active_transactions, setactive_transactions] = React.useState<
    ITransactionsSchema[]
  >([]);

  const [transactions, settransactions] = React.useState<ITransactionsSchema[]>(
    [
      {
        id: "aalalaa",
        studentFeesStructureId: "aksdieoe",
        amount: 20000,
        studentFeesStructure: null,
        deletedAt: "sss",
        addedAt: "2024-07-15T09:34:25.843227",
        updatedAt: "ajcclc",
      },
      {
        id: "aalalaa",
        studentFeesStructureId: "aksdieoe",
        amount: 30000,
        studentFeesStructure: null,
        deletedAt: "sss",
        addedAt: "2024-07-15T09:34:25.843227",
        updatedAt: "ajcclc",
      },
      {
        id: "aalalaa",
        studentFeesStructureId: "aksdieoe",
        amount: 50000,
        studentFeesStructure: null,
        deletedAt: "sss",
        addedAt: "2024-07-15T09:34:25.843227",
        updatedAt: "ajcclc",
      },
      {
        id: "aalalaa",
        studentFeesStructureId: "aksdieoe",
        amount: 80000,
        studentFeesStructure: null,
        deletedAt: "sss",
        addedAt: "2024-07-15T09:34:25.843227",
        updatedAt: "ajcclc",
      },
    ]
  );

  const GetTransactions = (paramz: object) => {
    Custom_Axios()
      .get(`/Transactions`, { params: paramz })
      .then((response) => {
        if (response.status == 200) {
          setactive_transactions(response.data);
        }
      });
  };

  const GetStudentById = () => {
    Custom_Axios()
      .get(`/Students/${params.student}`)
      .then((response) => {
        if (response.status == 200) {
          setStudent(response.data);
          GetStreamById(response.data["streamId"]);
          GetStudentFees(response.data["id"]);
          GetTerms();
          GetTransactions({ studentId: response.data["id"] });
        }
      });
  };

  const GetTerms = () => {
    Custom_Axios()
      .get(`/Terms`)
      .then((response) => {
        if (response.status == 200) {
          setterms(response.data);
        }
      });
  };

  const AddFeesStructure = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setsubmitting(true);

    const formdata = new FormData(event.currentTarget);
    const data = {
      studentId: params.student,
      termId: formdata.get("termId"),
      amount: formdata.get("amount"),
      isPaid: false,
    };

    Custom_Axios()
      .post(`/StudentFeesStructure`, data)
      .then((response) => {
        if (response.status == 200) {
          GetStudentFees(params.student);
          setFeedBack({
            message: "Fees Structure Added Successfully",
            open: true,
            status: "success",
            outlined: true,
          });
        } else {
          setFeedBack({
            message: "Failed to add Fees Structure",
            open: true,
            status: "error",
            outlined: true,
          });
        }
      })
      .catch((error) => {
        setFeedBack({
          message: "Failed to add Fees Structure",
          open: true,
          status: "error",
          outlined: true,
        });
      })
      .finally(() => {
        setsubmitting(false);
        setFeesEdit(false);
        setTimeout(() => {
          setFeedBack(null);
        }, 3000);
      });
  };

  const GetStudentFees = (student_id: string) => {
    Custom_Axios()
      .get(`/StudentFeesStructure?studentId=${student_id}`)
      .then((response) => {
        if (response.status == 200) {
          setfees(response.data);
        }
      });
  };

  const AddTransaction = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setsubmitting(true);

    const formdata = new FormData(event.currentTarget);

    const data  = {
      studentFeesStructureId: activeStruct?.id,
      amount: formdata.get("amount"),
    };

    Custom_Axios()
      .post(`/Transactions`, data)
      .then((response) => {
        if (response.status == 200) {
          GetTransactions({ studentId: params.student , studentFeesStructureId: activeStruct?.id });
          setFeedBack({
            message: "Transaction Added Successfully",
            open: true,
            status: "success",
            outlined: true,
          });
        } else {
          setFeedBack({
            message: "Failed to add Transaction",
            open: true,
            status: "error",
            outlined: true,
          });
        }
      })
      .catch((error) => {
        setFeedBack({
          message: "Failed to add Transaction",
          open: true,
          status: "error",
          outlined: true,
        });
      })
      .finally(() => {
        setsubmitting(false);
        setTransactionsEdit(false);
        setTimeout(() => {
          setFeedBack(null);
        }, 3000);
      });
  }

  const GetStructById = (id: string) => {
    Custom_Axios()
      .get(`/StudentFeesStructure/${id}`)
      .then((response) => {
        if (response.status == 200) {
          setActivestruct(response.data);
        }
      });
  };

  const OnSelection = (e: string[]) => {
    setselectedstructs(e);
    GetStructById(e[0]);
    GetTransactions({ studentId: params.student , studentFeesStructureId: e[0] });
  };

  const toggleEditDrawer = (newOpen: boolean) => {
    setFeesEdit(newOpen);
  };

  const toggleTransactionsDrawer = (newOpen: boolean) => {
    setTransactionsEdit(newOpen);
  }

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
        resolver: (row) => FormatMoney(row.amount),
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
        id: "Paid",
        numeric: false,
        disablePadding: true,
        label: "Paid",
        alignment: "left",
        resolver: (row) => (row.isPaid ? "Paid" : "Not Paid"),
      },
      {
        id: "Date Added",
        numeric: false,
        disablePadding: true,
        label: "Date assigned",
        alignment: "left",
        resolver: (row) => toDDMMYYYY(row.addedAt),
      },
      {
        id: "DateUpdated",
        numeric: false,
        disablePadding: true,
        label: "Last Updated",
        alignment: "left",
        resolver: (row) => toDDMMYYYY(row.updatedAt),
      },
    ];

    setheaders(headers);
  };

  const GetStreamById = (id: string) => {
    Custom_Axios()
      .get(`/Streams/${id}`)
      .then((response) => {
        if (response.status == 200) {
          setStream(response.data);
          GetClassById(response.data["classId"]);
        }
      });
  };

  const GetClassById = (id: string) => {
    Custom_Axios()
      .get(`/Classes/${id}`)
      .then((response) => {
        if (response.status == 200) {
          setClass(response.data);
        }
      });
  };

  const AddTransactionsFields = (): ReactNode => {
    return (
      <>
        <TextField
          sx={{ width: "25vw" }}
          name="studentId"
          label="Student ID"
          variant="outlined"
          disabled
          defaultValue={params.student}
        />
        <TextField
          sx={{ width: "25vw" }}
          name="termId"
          label="Term ID"
          variant="outlined"
          disabled
          defaultValue={activeStruct?.termId}
        />

        <TextField
          sx={{ width: "25vw" }}
          name="amount"
          label="Amount"
          variant="outlined"
          defaultValue={""}
        />
        <LoadingButton
          type="submit"
          sx={{ width: "25vw", height: "8vh" }}
          variant="contained"
          tabIndex={-1}
          loading={submitting}
          loadingPosition="start"
          startIcon={<SaveIcon fontSize="large" />}
        >
          <span>{`Save`}</span>
        </LoadingButton>
      </>
    );
  };

  const StructureFields = (): ReactNode => {
    return (
      <>
        <TextField
          sx={{ width: "25vw" }}
          name="studentId"
          label="Student ID"
          variant="outlined"
          disabled
          defaultValue={params.student}
        />
        <TextField
          select
          sx={{ width: "25vw" }}
          name="termId"
          label="Term ID"
          variant="outlined"
          defaultValue={activeStruct?.termId}
        >
          {terms.map((term) => {
            return (
              <MenuItem key={term.id} value={term.id}>
                {`${term.name} of ${term.addedAt.slice(0, 4)}`}
              </MenuItem>
            );
          })}
        </TextField>
        <TextField
          sx={{ width: "25vw" }}
          name="amount"
          label="Amount"
          variant="outlined"
          defaultValue={""}
        />
        <LoadingButton
          type="submit"
          sx={{ width: "25vw", height: "8vh" }}
          variant="contained"
          tabIndex={-1}
          loading={submitting}
          loadingPosition="start"
          startIcon={<SaveIcon fontSize="large" />}
        >
          <span>{`Save`}</span>
        </LoadingButton>
      </>
    );
  };

  React.useEffect(() => {
    GetStudentById();
    createheaders();
  }, []);

  const Transactions = () => {
    if (active_transactions.length < 0) {
      return (
        <div className="spinner-student">
          <CircularProgress />
        </div>
      );
    }

    return (
      <List sx={{ width: "27vw", minHeight: "30vh" }}>
        {active_transactions?.map(({ amount, addedAt }, index) => {
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
    );
  };

  if (Student == null) {
    return (
      <div className="spinner-student">
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      <FeedBack
        open={feedBack ? feedBack.open : false}
        message={feedBack ? feedBack.message : ""}
        outlined={feedBack ? feedBack.outlined : false}
        status={feedBack ? feedBack.status : "error"}
      />
      <div className="student-body">
        <div className="space" />
        <div className="st-panel-1">
          <Card className="student-info">
            <CardHeader
              title={`${Student.firstName} ${Student.otherNames}`}
            ></CardHeader>
            <CardContent>
              <div style={{ height: `7dvh`, width: "65dvw" }}>
                <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                  Student Profile Information
                </Typography>
              </div>
              <div className={"userInfo"}>
                <Typography sx={{ fontSize: 14 }} color="text.primary">
                  {`Student ID : ${Student.id}`}
                </Typography>
                <Typography sx={{ fontSize: 14 }} color="text.primary">
                  {`Name : ${Student.firstName} ${Student.otherNames}`}
                </Typography>
                <Typography sx={{ fontSize: 14 }} color="text.primary">
                  {`Pay Code : ${Student.payCode}`}
                </Typography>
                <Typography sx={{ fontSize: 14 }} color="text.primary">
                  {`Class: ${Class?.name} ${Stream?.name}`}
                </Typography>
                <Typography sx={{ fontSize: 14 }} color="text.primary">
                  {`Date Added: ${toDDMMYYYY(Student.addedAt)}`}
                </Typography>
                <Typography sx={{ fontSize: 14 }} color="text.primary">
                  {`Date Updated: ${toDDMMYYYY(Student.updatedAt)}`}
                </Typography>
              </div>

              <div className="space" />

              <div style={{ height: `7dvh`, width: "65dvw" }}>
                <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
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

          <div
            style={{
              minHeight: "80dvh",
              width: "28dvw",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <Card className="student-payments">
              <CardHeader
                title={`Last Payments for ${
                  activeStruct ? activeStruct.term.name : `all`
                }`}
              />
              <CardContent>
                <Transactions />
                <Divider />
                <div
                  style={{
                    height: "8dvh",
                    width: "28dvw",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <Typography>{`TOTAL : ${FormatMoney(
                    active_transactions?.reduce(
                      (acc, val) => acc + val.amount,
                      0
                    )
                  )}`}</Typography>
                </div>
              </CardContent>
            </Card>

            <Button
              variant="contained"
              style={{ width: "30vw" }}
              disabled={activeStruct == null}
              onClick={() => {
                setTransactionsEdit(true);
              }}
              startIcon={<AccountCircleOutlinedIcon />}
            >
              {`ADD PAYMENT ${
                activeStruct ? `FOR ${activeStruct.term.name}` : ``
              }`}
            </Button>

            <Button
              variant="contained"
              style={{ width: "30vw" }}
              color={"warning"}
              onClick={() => {
                setFeesEdit(true);
              }}
              startIcon={<AccountCircleOutlinedIcon />}
            >
              {`CONFIGURE TERM FEES`}
            </Button>
          </div>
        </div>

        <Edit
          open={feesEdit}
          Heading={"Add Fees Structure"}
          onSubmit={AddFeesStructure}
          toggleDrawer={toggleEditDrawer}
          Fields={StructureFields}
        />

        <Edit
          open={transactionsEdit}
          Heading={"Add Fees Structure Transaction"}
          onSubmit={AddTransaction}
          toggleDrawer={toggleTransactionsDrawer}
          Fields={AddTransactionsFields}
        />
      </div>
    </>
  );
}
