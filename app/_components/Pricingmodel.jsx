import { PricingTable } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Pricingmodel({ children }) {
  return (
    <Dialog>
      <DialogTrigger className="w-full">{children}</DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Upgrade Plan</DialogTitle>
          <DialogDescription>
            Choose the best plan for your needs below.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <PricingTable />
        </div>
      </DialogContent>
    </Dialog>
  );
}
