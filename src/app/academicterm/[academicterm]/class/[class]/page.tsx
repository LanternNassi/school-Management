/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import "./page.css";
import React from "react";

import { Typography, Button, Chip, TextField, MenuItem } from "@mui/material";
import { useRouter } from "next/navigation";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";

import Edit from "@/components/Edit";

import AutoDeleteOutlinedIcon from "@mui/icons-material/AutoDeleteOutlined";

import SelectAllTransferList from "@/components/TransferList";
import Custom_Axios from "@/components/CustomAxios";
import { IClassSchema } from "@/schema/IClassSchema";
import { IStreamSchema } from "@/schema/IStreamSchema";

export default function page({
  params,
}: {
  params: { academicterm: string; class: string };
}) {
  const router = useRouter();

  const [edit, setedit] = React.useState<boolean>(false);
  const [submitting, setsubmitting] = React.useState<boolean>(false);
  const [active_class, setactive_class] = React.useState<IClassSchema|null>(null)
  
  const [classes, setclasses] = React.useState<IClassSchema[]>([]);
  const [streams, setstreams] = React.useState<IStreamSchema[]>([]);
  const [targetstreams, settargetstreams] = React.useState<IStreamSchema[]>([]);

  const UpdatePref = () => {};

  const toggleEditDrawer = (newOpen: boolean) => {
    setedit(newOpen);
  };

  const FetchClasses = () => {
    Custom_Axios()
      .get(`/Classes`)
      .then((response) => {
        if (response.status == 200) {
          setclasses(response.data);
        }
      });
  };

  const FetchClass = (id : string) : void => {
      Custom_Axios()
        .get(`Classes/${id}`)
        .then(response => {
          if (response.status == 200){
            setactive_class(response.data)
          }
        })
  }

  const FetchStreamsByClass = (
    params: object,
    hook: (data: any) => void
  ): void => {
    Custom_Axios()
      .get(`Streams`, {params})
      .then((response) => {
        if (response.status == 200) {
          hook(response.data);
        }
      });
  };

  React.useEffect(() => {
    FetchClasses();

    FetchClass(params.class)

  }, []);

  FetchStreamsByClass({ Class: params.class }, setstreams);


  const Fields = () => {
    return (
      <>
        <TextField
          select
          sx={{ width: "25vw" }}
          name="original_stream"
          label="Original Stream"
          variant="outlined"
          onChange={(e) => {}}
        >
          {streams.map((stream, index) => (
            <MenuItem key={stream.name} value={stream.id}>
              {`${active_class?.name} ${stream.name}`}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          sx={{ width: "25vw" }}
          name="target_class"
          label="Target Class"
          variant="outlined"
          onChange={(e) => {
              FetchStreamsByClass({Class : e.target.value} , settargetstreams)
          }}
        >
          {
            classes.map((c , index) => (
              <MenuItem key={c.name} value={c.id}>
                {c.name}
              </MenuItem>
            ))
          }
        </TextField>

        <TextField
          select
          sx={{ width: "25vw" }}
          name="target_stream"
          label="Target Stream"
          variant="outlined"
          onChange={(e) => {

          }}
        >
          {
            targetstreams.map((c , index) => (
              <MenuItem key={c.name} value={c.id}>
                {`${active_class?.name} ${c.name}`}
              </MenuItem>
            ))
          }
        </TextField>

        <LoadingButton
          type="submit"
          sx={{ width: "25vw", height: "8vh" }}
          variant="contained"
          tabIndex={-1}
          loading={submitting}
          loadingPosition="start"
          startIcon={<SaveIcon fontSize="large" />}
        >
          <span>{`Update Preferences`}</span>
        </LoadingButton>
      </>
    );
  };

  return (
    <>
      <div className="termClass">
        <div className="termClass-classes">
          <div className="actionbar">
            <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
              Term Information
            </Typography>

            <div
              style={{
                height: "8dvh",
                width: "40dvw",

                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  height: "8dvh",
                  width: "20dvw",

                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <Chip label={"S.1 West"} color={"warning"} />
                <Chip label={"S.2 East"} color={"warning"} />
              </div>

              <Button
                variant="contained"
                color="success"
                onClick={() => {

                  setedit(true);
                }}
                startIcon={<AutoDeleteOutlinedIcon />}
              >
                {`Change Settings`}
              </Button>
            </div>
          </div>
          <SelectAllTransferList />
        </div>

        <div className="termClass-reqs">
          
        </div>
      </div>

      <Edit
        open={edit}
        Heading={"CLASS PREFERENCES"}
        onSubmit={UpdatePref}
        toggleDrawer={toggleEditDrawer}
        Fields={Fields}
      />
    </>
  );
}
