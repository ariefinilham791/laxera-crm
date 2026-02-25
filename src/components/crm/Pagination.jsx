 'use client'
 import { Pagination } from 'react-bootstrap';
 
 const Pager = ({ page, pages, onChange }) => {
   if (pages <= 1) return null;
   const items = [];
   for (let p = 1; p <= pages; p++) {
     items.push(
       <Pagination.Item key={p} active={p === page} onClick={() => onChange(p)}>
         {p}
       </Pagination.Item>
     );
   }
   return <Pagination className="mb-0">{items}</Pagination>;
 }
 
 export default Pager
