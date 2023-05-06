import { Input } from "@ds/input";
import { Button } from "@ds/button";

export default function Worker(){
  return (
    <>
      <div className="flex h-screen bg-slate-500">
        <div className="flex flex-col w-2/5">test1</div>
        <div className="flex flex-col w-3/5">
        <div className="flex flex-col h-4/5">test2</div>
          <div className="flex flex-col h-1/5 justify-center">
            <div className="flex w-4/5">
              <Input type="text" className="border-r-0 rounded-r-none w-full"></Input>
              <Button intent="inner-form" className="border-l-0 rounded-l-none"><span className="material-icons">send</span></Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}