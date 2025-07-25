
// function Settings() {
//     const { isAuthenticated, user } = useAppContext();
   
//     return isAuthenticated && user ? (
//       <div className="w-full overflow-y-hidden p-1">
//         <div>Welcome back, {user.username}!</div>
//         <div className="flex flex-1 flex-col">
//           <div className="flex-none">
//             {/* <h3 className="text-lg font-medium">Profile</h3> */}
//             {/* <p className="text-muted-foreground text-sm">This is how others will see you on the site.</p> */}
//           </div>
//         </div>
//         <div data-orientation="horizontal" className="bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-4 flex-none"></div>
//         <div className="faded-bottom h-full w-full overflow-y-auto scroll-smooth pr-4 pb-12">
//           <div className="-mx-1 px-1.5 lg:max-w-xl">
//             {/* <form className="space-y-8">
//               <div data-slot="form-item" className="grid gap-2">
//                 <Label htmlFor="username" className="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 data-[error=true]:text-destructive">Username</Label>
//                 <Input onChange={() => {console.log('Rowell')}} value={user.username} defaultValue={user.username} />
//                 <p data-slot="form-description" id="«rnk»-form-item-description" className="text-muted-foreground text-sm">This is your public display name. It can be your real name or a pseudonym. You can only change this once every 30 days.</p></div>
//                 <div data-slot="form-item" className="grid gap-2">
//                   <Label htmlFor="email">Email</Label>
//                   <Select>
//                     <SelectTrigger className="w-[180px]">
//                       <SelectValue placeholder="Select a verified email to display" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="light">Light</SelectItem>
//                       <SelectItem value="dark">Dark</SelectItem>
//                       <SelectItem value="system">System</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <p data-slot="form-description" id="«rnl»-form-item-description" className="text-muted-foreground text-sm">You can manage verified email addresses in your <a href="/">email settings</a>.</p></div><div data-slot="form-item" className="grid gap-2">
//                   <Label htmlFor="bio"  className="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 data-[error=true]:text-destructive">Bio</Label>
//                   <Textarea onChange={() => {console.log('This is about me')}} placeholder="Tell us a little bit about yourself" name="bio"  value={''}/>
//                   <p data-slot="form-description" id="«rnn»-form-item-description" className="text-muted-foreground text-sm">You can <span>@mention</span> other users and organizations to link to them.</p>
//                 </div>
//               <button data-slot="button" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([className*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[&gt;svg]:px-3" type="submit">Update profile</button>
//             </form> */}
//           </div>
//         </div>
//       </div>
//     ) : (
//       <div>Please sign in</div>
//     );
// }

export default function Settings() {

  return (
    <div className="p-6 flex-1 space-y-6 ">
      <div>
        <h1 className="text-3xl font-bold ">Settings</h1>
        <p className="">Manage your account settings and preferences.</p>
      </div>

 
    </div>
  );
}


// export default Settings;