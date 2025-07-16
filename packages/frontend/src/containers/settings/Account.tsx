
import { useAppContext } from '@/lib/contextLib'

function Account() {
    const { isAuthenticated, user } = useAppContext();
   
    return isAuthenticated && user ? (
      <div className="w-full overflow-y-hidden p-1">
        <div>Welcome back, {user.username}!</div>
        <div className="flex flex-1 flex-col">
          <div className="flex-none">
            <h3 className="text-lg font-medium">Account Settings</h3>
            {/* <p className="text-muted-foreground text-sm">This is how others will see you on the site.</p> */}
          </div>
        </div>
        <div data-orientation="horizontal" className="bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-4 flex-none"></div>
        <div className="faded-bottom h-full w-full overflow-y-auto scroll-smooth pr-4 pb-12">
          <div className="-mx-1 px-1.5 lg:max-w-xl">
      
          </div>
        </div>
      </div>
    ) : (
      <div>Please sign in</div>
    );
}

export default Account;