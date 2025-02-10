

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <div>
          {/* <Navbar />
        <div className="mt-10 flex flex-row justify-center items-center">

<AdminDashboardComponent/>
        </div> */}
        {children}
      
    </div>
     
  );
}
