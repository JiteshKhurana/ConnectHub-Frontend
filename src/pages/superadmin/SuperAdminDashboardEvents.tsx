import CardShimmer from "@/components/CardShimmer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useEvents from "@/hooks/useEvents";
import { timeConverter } from "@/lib/helper";
import { RootState } from "@/store/store";
import { Search } from "lucide-react";
import { BiLinkExternal } from "react-icons/bi";
import { useSelector } from "react-redux";

const SuperAdminDashboardEvents = () => {
  useEvents();

  const Events = useSelector((store: RootState) => store.events.eventsList);
  if (!Events) return <CardShimmer />;
  return (
    <div className="flex min-h-screen w-full flex-col ">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="">
              <CardHeader className="m-0 px-0">
                <CardTitle className="text-xl">Events</CardTitle>
                <CardDescription>View and Manage all Events.</CardDescription>
              </CardHeader>
              <div className="flex flex-wrap gap-3">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="draft">Upcoming</TabsTrigger>
                  <TabsTrigger value="archived" className="hidden sm:flex">
                    Past
                  </TabsTrigger>
                </TabsList>
                <div className="relative ml-auto flex-1 md:grow-0">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full min-w-[300px] rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                  />
                </div>
              </div>
            </div>
            <TabsContent value="all">
              <Card x-chunk="dashboard-06-chunk-1">
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="hidden w-[100px] sm:table-cell">
                          <span className="hidden">Image</span>
                        </TableHead>
                        <TableHead>Event Name</TableHead>
                        <TableHead>Society Name</TableHead>
                        <TableHead>Visibility</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Event Type</TableHead>
                        <TableHead>Event Mode</TableHead>
                        <TableHead>Venue</TableHead>
                        <TableHead>Event Dashboard</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Events.map((event) => {
                        return (
                          <TableRow>
                            <TableCell className="hidden sm:table-cell">
                              <img
                                src={event.image}
                                alt="Event image"
                                className="aspect-square rounded-md object-cover"
                                height="64"
                                width="64"
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              {event.title}
                            </TableCell>
                            <TableCell className="font-medium">
                              {event.soc_name}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={`${
                                  event.visibility === "true"
                                    ? "text-green-500"
                                    : "text-red-500"
                                }`}
                                variant="outline"
                              >
                                {event.visibility === "true"
                                  ? "Public"
                                  : "Private"}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {timeConverter(event.start_date, true)}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {timeConverter(event.end_date, true)}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {event.event_type}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {event.event_mode}
                              </Badge>
                            </TableCell>
                            <TableCell>{event.venue}</TableCell>
                            <TableCell>
                              <Button
                                onClick={() => {}}
                                className="flex items-center gap-1"
                              >
                                <BiLinkExternal /> Society Dashboard
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default SuperAdminDashboardEvents;
