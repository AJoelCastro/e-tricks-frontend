import { Button, Typography } from '@mui/material'
import React from 'react'

const RightSide = () => {

    return (
        <div className='w-[75vw]'>
            <div className='flex mx-8 justify-between items-center bg-white rounded-xl px-8 py-4'>
                <Typography variant='h7'>
                    FILTRAR POR
                </Typography>
                <Button >
                    <Typography variant='h7'>
                        NOMBRE
                    </Typography>
                </Button>
                <Button>
                    <Typography variant='h7'>
                    MARCA
                    </Typography>
                </Button>
            </div>
        </div>
    )
}

export default RightSide
