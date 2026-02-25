 'use client'
 import { Badge, Button, ButtonGroup } from 'react-bootstrap';
 import { Layers, Sliders, Columns, List, Maximize, Grid } from 'react-feather';
 
 const CrmToolbar = ({
   filtersCount = 0,
   onGroups,
   onFilters,
   onGroupBy,
   onFields,
   onRowHeight,
   onLayout
 }) => {
   return (
     <div className="d-flex align-items-center flex-wrap gap-2">
       <Button variant="outline-light" size="sm" onClick={onGroups}>
         <span className="icon"><span className="feather-icon"><Layers /></span></span>
         <span className="btn-text ms-1">Groups</span>
       </Button>
       <Button variant="outline-light" size="sm" onClick={onFilters}>
         <span className="icon"><span className="feather-icon"><Sliders /></span></span>
         <span className="btn-text ms-1">Filters</span>
         {filtersCount > 0 && <Badge bg="secondary" size="sm" className="ms-2">{filtersCount}</Badge>}
       </Button>
       <Button variant="outline-light" size="sm" onClick={onGroupBy}>
         <span className="icon"><span className="feather-icon"><Columns /></span></span>
         <span className="btn-text ms-1">Group by</span>
       </Button>
       <Button variant="outline-light" size="sm" onClick={onFields}>
         <span className="icon"><span className="feather-icon"><List /></span></span>
         <span className="btn-text ms-1">Fields</span>
       </Button>
       <ButtonGroup size="sm">
         <Button variant="outline-light" onClick={onRowHeight}>
           <span className="icon"><span className="feather-icon"><Maximize /></span></span>
           <span className="btn-text ms-1">Row height</span>
         </Button>
         <Button variant="outline-light" onClick={onLayout}>
           <span className="icon"><span className="feather-icon"><Grid /></span></span>
           <span className="btn-text ms-1">Layout</span>
         </Button>
       </ButtonGroup>
     </div>
   )
 }
 
 export default CrmToolbar
