import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        items: [
          {
            title: "Welcome",
            url: "/",
          },
        ],
      },
      // {
      //   title: "Profile",
      //   url: "/profile",
      //   icon: Icons.User,
      //   items: [],
      // },
      {
        title: "Users",
        url: "/tables",
        icon: Icons.User,
        items: [
          {
            title: "Experts",
            url: "/atlas/experts",
          },
          {
            title: "Customers",
            url: "/atlas/customers",
          },
        ],
      },
      {
        title: "Settlements",
        icon: Icons.SettlementIcon,
        items: [
          {
            title: "Pending",
            url: "/atlas/pending",
          },
          {
            title: "Settled",
            url: "/atlas/settled",
          },
          {
            title: "Rejected",
            url: "/atlas/rejected",
          },
        ],
      },
      {
        title: "Sessions & Payments",
        icon: Icons.SettlementIcon,
        items: [
          {
            title: "Sessions",
            url: "/atlas/sessions",
          },
          {
            title: "Payments",
            url: "/atlas/payments",
          },
        ],
      },
      {
        title: "System Wallet",
        url: "/atlas/system",
        icon: Icons.WalletIcon,
        items: [],
      },
      // {
      //   title: "System Wallet",
      //   icon: Icons.Alphabet,
      //   items: [
      //     {
      //       title: "Settings",
      //       url: "/pages/settings",
      //     },
      //   ],
      // },
    ],
  },
  {
    label: "OTHERS",
    items: [
      // {
      //   title: "Charts",
      //   icon: Icons.PieChart,
      //   items: [
      //     {
      //       title: "Basic Chart",
      //       url: "/charts/basic-chart",
      //     },
      //   ],
      // },
      // {
      //   title: "UI Elements",
      //   icon: Icons.FourCircle,
      //   items: [
      //     {
      //       title: "Alerts",
      //       url: "/ui-elements/alerts",
      //     },
      //     {
      //       title: "Buttons",
      //       url: "/ui-elements/buttons",
      //     },
      //   ],
      // },
      {
        title: "Setting",
        icon: Icons.SettingsIcon,
        items: [
          {
            title: "Change Password",
            url: "/atlas/settings",
          },
        ],
      },
    ],
  },
];
