import { Card, Typography } from '@material-ui/core'
import React from 'react'
import './Infobox.css'

const InfoBox = ({title, total, cases, bgcolor}) => {
  return(
    <Card className="infobox">
        <Typography className="infobox_title" color="textSecondary">
            {title}
        </Typography>

        <h2 className="infobox_cases">{cases}</h2>

        <Typography className="infobox_total" color="textSecondary">
            {total} Total
        </Typography>



    </Card>
   )

 }

export default InfoBox