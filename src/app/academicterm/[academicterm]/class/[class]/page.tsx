/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React from 'react'
import { useRouter } from "next/navigation";


export default function page({ params }: { params: { academicterm: string; class: string; } }) {
    const router = useRouter();
    return (
        <div>{params.academicterm}</div>
    )
}

