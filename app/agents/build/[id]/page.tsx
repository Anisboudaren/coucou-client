import { AppSidebar } from "@/components/app-sidebar"
import { BasicSettings } from "@/components/forms/Basic-settings"
import { BuildConfiguration } from "@/components/forms/Configurations"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="pb-14 ">
        <SiteHeader />
        <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2 px-4 md:px-6">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            {/* Section for the title */}
            <div className="px-2">
              <h1 className="text-2xl font-semibold">Edit Your AI Build</h1>
              <p className="text-xl text-muted-foreground">Set up and personnlize your Ai Agent for taillored experience.</p>
            </div>
          </div>

          {/* Main flex container */}
          <div className="flex flex-col md:flex-row gap-4">
            {/*BasicSettings */}
            <div className="md:w-1/3 w-full p-6 rounded-2xl border-[0.5px] border-gray-400 bg-sidebar ">
            <h2 className="text-xl font-semibold mb-4">Basic Settings</h2>
           
            <BasicSettings />
            </div>

           {/* addition settings */}
            <div className="md:w-2/3 w-full p-6 rounded-2xl border-[0.5px] border-gray-400 bg-sidebar">
              {/* Add content here for the second section */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Additional Settings</h2>
                
                <BuildConfiguration />
              </div>
            </div>
          </div>
        </div>
      </div>

      </SidebarInset>
    </SidebarProvider>
  )
}
