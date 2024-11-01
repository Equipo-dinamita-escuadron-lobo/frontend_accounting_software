declare namespace DataTables {
    interface Settings {
      pagingType?: string;
      pageLength?: number;
      responsive?: boolean;
      lengthChange?: boolean;
      autoWidth?: boolean;
      columns?: any[];
      dom?: string;
      buttons?: any[];
      language?: object;
    }

    interface Api {
      clear: () => Api;
      rows: {
        add: (data: any[]) => Api;
      };
      draw: () => Api;
      destroy: () => void;
    }
  }
