 'use client'
 import { Container } from 'react-bootstrap';
 import { Users } from 'react-feather';
 import CrmPageHeader from '@/components/crm/CrmPageHeader';
 import CustomerTable from '@/components/crm/CustomerTable';
 
 const CustomersPage = () => {
   return (
     <Container fluid="xxl">
       <CrmPageHeader
         title="Customers Management"
         subtitle="Kelola data pelanggan. Data hanya di session (hilang saat refresh)."
         icon={Users}
         accent
       />
       <div className="hk-pg-body">
         <CustomerTable />
       </div>
     </Container>
   )
 }
 
 export default CustomersPage
